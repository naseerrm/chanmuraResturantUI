import { MenuItem } from './menu-item.model';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Served' | 'Completed';

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  tableNumber?: string;
  customerName?: string;
  orderTime: Date;
}


export interface OrderRecord {
  id?: string; // Firestore document ID
  orderId: number,
  customerName: string;
  mobileNumber: string | number;
  items: {
    id?: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  orderTime: Date;
}