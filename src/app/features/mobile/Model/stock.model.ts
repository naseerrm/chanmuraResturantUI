export interface StockMovement {
  movementId?: string;
  productId: string;
  variantId?: string;
  stockIn?: number;
  stockOut?: number;
  reason?: string;
  createdAt?: any;
}
