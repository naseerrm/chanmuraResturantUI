export interface MenuItem {
  id?: string;                 // Firestore document id (string)
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  quantity: number; // quantity in the order
  quantityAvailable: number; // current stock
}
