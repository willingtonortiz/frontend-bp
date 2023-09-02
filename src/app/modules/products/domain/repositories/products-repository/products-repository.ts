import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductItemDto } from './products-repository-models';

export interface ProductsRepository {
  getAll(): Observable<ProductItemDto[]>;
  checkIdExists(id: string): Observable<boolean>;
  getOne(id: string): Observable<ProductItemDto | null>;
  addOne(product: ProductItemDto): Observable<ProductItemDto>;
  updateOne(product: ProductItemDto): Observable<ProductItemDto>;
  deleteOne(id: string): Observable<void>;
}

export const ProductsRepository = new InjectionToken<ProductsRepository>(
  'ProductsRepository',
);
