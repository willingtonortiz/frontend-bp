import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductItemDto } from './products-repository-models';

export interface ProductsRepository {
  getAll(): Observable<ProductItemDto[]>;
  checkIdExists(id: string): Observable<boolean>;
  addOne(product: ProductItemDto): Observable<ProductItemDto>;
}

export const ProductsRepository = new InjectionToken<ProductsRepository>(
  'ProductsRepository',
);
