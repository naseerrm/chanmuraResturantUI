export interface Product {
  productId?: string;
  name: string;
  categoryId: string;
  brand?: string;
  gst?: number;
  isVariant?: boolean;
  baseImage?: string;            // primary image url
  images?: string[];            // additional image urls
  createdAt?: any;
  updatedAt?: any;
}
