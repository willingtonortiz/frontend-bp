import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ProductsRepository,
  ProductItemDto,
} from '../../../domain/repositories/products-repository';
import { ProductResources } from '../../constants/resources';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HttpProductsRepository implements ProductsRepository {
  constructor(private readonly client: HttpClient) {}

  getAll(): Observable<ProductItemDto[]> {
    const url = ProductResources.getProducts.replace(
      ':base',
      environment.productsApiUrl,
    );

    return this.client.get<ProductItemDto[]>(url, {
      headers: { authorId: '252135325' },
    });
  }
}
