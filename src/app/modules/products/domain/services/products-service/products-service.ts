import { Observable } from 'rxjs';
import { ProductItem } from '../../models/product';
import { InjectionToken } from '@angular/core';

export interface ProductsService {
  getAll(): Observable<ProductItem[]>;
  getOne(id: string): Observable<ProductItem | null>;
  checkIdExists(id: string): Observable<boolean>;
  addOne(product: ProductItem): Observable<ProductItem>;
  updateOne(product: ProductItem): Observable<ProductItem>;
  deleteOne(id: string): Observable<void>;
}

export const ProductsService = new InjectionToken<ProductsService>(
  'ProductsService',
);
