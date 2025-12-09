export interface KdsMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
  quantityAvailable?: number;
}


export interface KdsItem {
  menuItem: KdsMenuItem;
  quantity: number;
  totalPrice: number;
  itemStatus?: 'pending' | 'preparing' | 'ready';
  displayName?: string;
  qty?: number;
}

export interface KdsOrder {
  table: string;
  status: string;
  items: KdsItem[];
  startTime?: string;
  EndTime?: string;
}
