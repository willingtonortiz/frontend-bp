import { Observable } from 'rxjs';
import { ProductItem } from '../../models/product';
import { InjectionToken } from '@angular/core';

export interface ProductsService {
  getAll(): Observable<ProductItem[]>;
}

export const ProductsService = new InjectionToken<ProductsService>(
  'ProductsService',
);
