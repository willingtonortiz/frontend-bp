import { Observable } from 'rxjs';
import { ProductItem } from '../../models/product';
import { InjectionToken } from '@angular/core';

export interface ProductsService {
  getAll(): Observable<ProductItem[]>;
  checkIdExists(id: string): Observable<boolean>;
  addProduct(product: ProductItem): Observable<ProductItem>;
}

export const ProductsService = new InjectionToken<ProductsService>(
  'ProductsService',
);
