export interface CartItemInterface {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CartInterface {
  id?: number;
  userId: number;
  item: CartItemInterface;
}

export interface CartSummaryInterface {
  subtotal: number;
  shipping: number;
  total: number;
}
