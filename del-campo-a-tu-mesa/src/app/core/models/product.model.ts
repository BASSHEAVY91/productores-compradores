export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  category: ProductCategory;
  location: string;
  photoUrl?: string;
  producerId: string;
  active: boolean;
  createdAt: string;
}

export enum ProductCategory {
  FRUTAS = 'frutas',
  VERDURAS = 'verduras',
  LACTEOS = 'lacteos',
  GRANOS = 'granos',
  OTROS = 'otros',
}

export interface ProductFilter {
  name?: string;
  category?: ProductCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}
