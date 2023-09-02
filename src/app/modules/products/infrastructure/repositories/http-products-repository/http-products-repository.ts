import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
    const url = ProductResources.getAll.replace(
      ':base',
      environment.productsApiUrl,
    );

    return this.client.get<ProductItemDto[]>(url, {
      headers: { authorId: environment.authorId },
    });
  }

  checkIdExists(id: string): Observable<boolean> {
    const url = ProductResources.checkIdExists
      .replace(':base', environment.productsApiUrl)
      .replace(':id', id);

    return this.client.get<boolean>(url, {
      headers: { authorId: environment.authorId },
    });
  }

  getOne(id: string): Observable<ProductItemDto | null> {
    const url = ProductResources.getOne.replace(
      ':base',
      environment.productsApiUrl,
    );

    return this.client
      .get<ProductItemDto[]>(url, {
        headers: { authorId: environment.authorId },
      })
      .pipe(
        map((products) => products.find((product) => product.id === id)),
        map((product) => product ?? null),
      );
  }

  addOne(product: ProductItemDto): Observable<ProductItemDto> {
    const url = ProductResources.addOne.replace(
      ':base',
      environment.productsApiUrl,
    );

    return this.client.post<ProductItemDto>(url, product, {
      headers: { authorId: environment.authorId },
    });
  }

  updateOne(product: ProductItemDto): Observable<ProductItemDto> {
    const url = ProductResources.updateOne
      .replace(':base', environment.productsApiUrl)
      .replace(':id', product.id);

    return this.client.put<ProductItemDto>(url, product, {
      headers: { authorId: environment.authorId },
    });
  }
}
