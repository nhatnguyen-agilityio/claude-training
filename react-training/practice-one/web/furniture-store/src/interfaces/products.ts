import type { ImageInterface } from './image';

export interface ProductVariant {
  id: number;
  hex: string;
  size: string;
  stock: number;
  images: ImageInterface[];
}

export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  variants: ProductVariant[];
}
