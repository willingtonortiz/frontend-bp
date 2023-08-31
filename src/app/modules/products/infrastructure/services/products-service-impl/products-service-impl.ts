import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProductsService } from '../../../domain/services/products-service';
import { ProductItem } from '../../../domain/models/product';
import {
  ProductItemDto,
  ProductsRepository,
} from '../../../domain/repositories/products-repository';

@Injectable({
  providedIn: 'root',
})
export class ProductsServiceImpl implements ProductsService {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
  ) {}

  getAll(): Observable<ProductItem[]> {
    return this.productsRepository
      .getAll()
      .pipe(map((products) => products.map(productItemDtoToProductItem)));
  }
}

function productItemDtoToProductItem(
  productItemDto: ProductItemDto,
): ProductItem {
  return {
    id: productItemDto.id,
    name: productItemDto.name,
    description: productItemDto.description,
    logo: productItemDto.logo,
    dateRelease: productItemDto.date_release,
    dateRevision: productItemDto.date_revision,
  };
}
