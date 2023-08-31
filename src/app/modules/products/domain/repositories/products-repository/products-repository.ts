import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductItemDto } from './products-repository-models';

export interface ProductsRepository {
  getAll(): Observable<ProductItemDto[]>;
}

export const ProductsRepository = new InjectionToken<ProductsRepository>(
  'ProductsRepository',
);
