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
      headers: { authorId: environment.authorId },
    });
  }

  checkIdExists(id: string): Observable<boolean> {
    const url = ProductResources.verifyId
      .replace(':base', environment.productsApiUrl)
      .replace(':id', id);

    return this.client.get<boolean>(url, {
      headers: { authorId: environment.authorId },
    });
  }

  addProduct(product: ProductItemDto): Observable<ProductItemDto> {
    const url = ProductResources.addProduct.replace(
      ':base',
      environment.productsApiUrl,
    );

    return this.client.post<ProductItemDto>(url, product, {
      headers: { authorId: environment.authorId },
    });
  }
}
