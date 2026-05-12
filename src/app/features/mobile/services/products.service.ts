import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, where, addDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Product } from '../Model/product.model';
import { ProductVariant } from '../Model/variant.model';
import { StockMovement } from '../Model/stock.model';
import { RestaurantContextService } from '../../restaurant-context.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
   companyId: string = '';

  constructor(private firestore: Firestore, private storage: Storage, private restaurantContext: RestaurantContextService) {
     this.restaurantContext.userDetail$.subscribe(async (user) => {
      if (!user) return;

      this.companyId = user.companyId;
    });
  }

  // LIST products with variant count (returns array of { product, variantCount })
  async listProductsWithVariantCount(): Promise<Array<{ product: Product, variantCount: number, id: string }>> {
    const colRef = collection(this.firestore, `Companies/${this.companyId}/Products`);
    const snaps = await getDocs(colRef);
    const out: Array<{ product: Product, variantCount: number, id: string }> = [];

    for (const docSnap of snaps.docs) {
      const p = docSnap.data() as Product;
      const pid = docSnap.id;
      // count variants
      const vCol = collection(this.firestore, `Companies/${this.companyId}/Products/${pid}/Variants`);
      const vSnap = await getDocs(vCol);
      out.push({ product: p, variantCount: vSnap.size, id: pid });
    }
    return out;
  }

  // GET single product + variants
  async getProductWithVariants(productId: string): Promise<{ product: Product|null, variants: ProductVariant[] }> {
    const pRef = doc(this.firestore, `Companies/${this.companyId}/Products/${productId}`);
    const pSnap = await getDoc(pRef);
    if (!pSnap.exists()) return { product: null, variants: [] };
    const product = pSnap.data() as Product;

    const vCol = collection(this.firestore, `Companies/${this.companyId}/Products/${productId}/Variants`);
    const vSnap = await getDocs(vCol);
    const variants: ProductVariant[] = vSnap.docs.map((d: { data: () => any; id: any; }) => ({ ...(d.data() as any), variantId: d.id }));
    return { product, variants };
  }

  // CREATE product + variants + optional stock movement entries
  async createProductWithVariants(product: Product, variants: ProductVariant[], imageFiles?: File[]): Promise<string> {
    // create product doc with generated id
    const productsCol = collection(this.firestore, `Companies/${this.companyId}/Products`);
    const productRef = doc(productsCol); // new doc ref with id
    product.productId = productRef.id;
    product.createdAt = new Date();
    product.updatedAt = new Date();
    // product.images = product.images || [];

    // // upload images first (if any)
     if (imageFiles && imageFiles.length) {
       const urls = await this.uploadMultipleImages(productRef.id, imageFiles);
       if (urls.length) {
         product.baseImage = urls[0];
         product.images = urls;
      }
     }

    await setDoc(productRef, product);

    // create variants
    for (const v of variants) {
      const vCol = collection(this.firestore, `Companies/${this.companyId}/Products/${productRef.id}/Variants`);
      const vRef = doc(vCol);
      v.variantId = vRef.id;
      v.createdAt = new Date();
      v.updatedAt = new Date();

      // if SKU not provided, generate
      if (!v.sku) {
        v.sku = this.generateSKU(product.name || 'PRD', v);
      }

      await setDoc(vRef, v);

      // create stock movement entry if initial stock > 0
      if (v.stock && v.stock > 0) {
        await this.createStockMovement({
          productId: productRef.id,
          variantId: v.variantId,
          stockIn: v.stock,
          stockOut: 0,
          reason: 'Initial stock on product create',
          createdAt: new Date()
        });
      }
    }

    return productRef.id;
  }

  // UPDATE product and its variants (replaces variants in subcollection if provided)
  async updateProductWithVariants(productId: string, product: Partial<Product>, variants?: ProductVariant[], imageFiles?: File[]): Promise<void> {
    const pRef = doc(this.firestore, `Companies/${this.companyId}/Products/${productId}`);
    product.updatedAt = new Date();

     // handle image upload
     if (imageFiles && imageFiles.length) {
       const urls = await this.uploadMultipleImages(productId, imageFiles);
       if (urls.length) {
         product.baseImage = urls[0];
        product.images = urls;
       }
     }

    await updateDoc(pRef, product as any);

    if (variants) {
      // For simplicity: we'll upsert each variant by id if present, else create
      for (const v of variants) {
        const vCol = collection(this.firestore, `Companies/${this.companyId}/Products/${productId}/Variants`);
        if (v.variantId) {
          const vRef = doc(this.firestore, `Companies/${this.companyId}/Products/${productId}/Variants/${v.variantId}`);
          v.updatedAt = new Date();

          // if stock changed, compute diff and create stock movement
          const existing = (await getDoc(vRef)).exists() ? (await getDoc(vRef)).data() as any : null;
          if (existing) {
            const oldStock = existing.stock || 0;
            const newStock = v.stock || 0;
            const diff = newStock - oldStock;
            if (diff !== 0) {
              if (diff > 0) {
                await this.createStockMovement({
                  productId,
                  variantId: v.variantId,
                  stockIn: diff,
                  stockOut: 0,
                  reason: 'Stock adjusted on variant update',
                  createdAt: new Date()
                });
              } else {
                await this.createStockMovement({
                  productId,
                  variantId: v.variantId,
                  stockIn: 0,
                  stockOut: Math.abs(diff),
                  reason: 'Stock decreased on variant update',
                  createdAt: new Date()
                });
              }
            }
          }
          await setDoc(vRef, v as any, { merge: true });
        } else {
          // new variant
          const newVRef = doc(vCol);
          v.variantId = newVRef.id;
          v.createdAt = new Date();
          v.updatedAt = new Date();
          if (!v.sku) v.sku = this.generateSKU(product.name || 'PRD', v);
          await setDoc(newVRef, v as any);

          if (v.stock && v.stock > 0) {
            await this.createStockMovement({
              productId,
              variantId: v.variantId,
              stockIn: v.stock,
              stockOut: 0,
              reason: 'Initial stock on new variant',
              createdAt: new Date()
            });
          }
        }
      }
    }
  }

  // UPLOAD multiple images to Storage under /companies/{companyId}/products/{productId}/images/
   async uploadMultipleImages(productId: string, files: File[]): Promise<string[]> {
     const urls: string[] = [];
     for (const f of files) {
      const uniqueId = crypto.randomUUID();  // Built-in browser ID generator
       const path = `companies/${this.companyId}/products/${productId}/images/${uniqueId}_${f.name}`;
       const storageRef = ref(this.storage, path);
       const snap = await uploadBytes(storageRef, f);
       const url = await getDownloadURL(snap.ref);
       urls.push(url);
     }
    return urls;
  }

  // CREATE stock movement record
  async createStockMovement(m: StockMovement): Promise<string> {
    const colRef = collection(this.firestore, `Companies/${this.companyId}/StockMovement`);
    const mvRef = doc(colRef);
    m.movementId = mvRef.id;
    m.createdAt = m.createdAt || new Date();
    await setDoc(mvRef, m as any);
    return mvRef.id;
  }

  // SKU generator: PRODUCTNAME-abbrev + RAM + STORAGE + COLOR e.g. A55-8-128-BLK
  generateSKU(productName: string, v: ProductVariant): string {
    const normalize = (s?: string) => (s || '').toString().trim().toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9\-]/g, '');
    const namePart = productName.split(' ').slice(0,2).map(w=>w.substring(0,3)).join('').toUpperCase();
    const ram = (v.ram || '').replace(/GB/gi, '').trim();
    const storage = (v.storage || '').replace(/GB/gi, '').trim();
    const color = (v.color || '').split(' ')[0].substring(0,3).toUpperCase();
    const sku = `${namePart}-${ram || 'NA'}-${storage || 'NA'}-${color || 'STD'}`;
    return sku;
  }

  // OPTIONAL helper: get categories (observable style omitted - use your preferred pattern)
  async getCategories(): Promise<Array<{ id: string, name: string }>> {
    const col = collection(this.firestore, `Companies/${this.companyId}/Categories`);
    const snap = await getDocs(col);
    return snap.docs.map((d: { id: any; data: () => any; }) => ({ id: d.id, ...d.data() } as any));
  }

    createProduct(product: any) {
    const productRef = doc(collection(
      this.firestore, `Companies/${this.companyId}/Products`
    ));

    product.productId = productRef.id;
    return setDoc(productRef, product);
  }

  createVariant(productId: string, variant: any) {
    const id = crypto.randomUUID();
    const ref = doc(this.firestore,
      `Companies/${this.companyId}/Products/${productId}/Variants/${id}`
    );
    variant.variantId = id;
    return setDoc(ref, variant);
  }

  async uploadImages(productId: string, files: File[]) {
    const urls: string[] = [];
    for (const f of files) {
      const path = `Companies/${this.companyId}/Products/${productId}/images/${crypto.randomUUID()}_${f.name}`;
      const sRef = ref(this.storage, path);
      const snap = await uploadBytes(sRef, f);
      urls.push(await getDownloadURL(snap.ref));
    }
    return urls;
  }
}
