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

  checkIdExists(id: string): Observable<boolean> {
    return this.productsRepository.checkIdExists(id);
  }

  getOne(id: string): Observable<ProductItem | null> {
    return this.productsRepository.getOne(id).pipe(
      map((product) => {
        if (product) {
          return productItemDtoToProductItem(product);
        }
        return null;
      }),
    );
  }

  addOne(product: ProductItem): Observable<ProductItem> {
    console.log(product);
    product.dateRelease = fromDDMMYYYYTOYYYYMMDD(product.dateRelease);
    product.dateRevision = fromDDMMYYYYTOYYYYMMDD(product.dateRevision);

    const productDto = productItemToProductItemDto(product);
    return this.productsRepository
      .addOne(productDto)
      .pipe(map(productItemDtoToProductItem));
  }

  updateOne(product: ProductItem): Observable<ProductItem> {
    product.dateRelease = fromDDMMYYYYTOYYYYMMDD(product.dateRelease);
    product.dateRevision = fromDDMMYYYYTOYYYYMMDD(product.dateRevision);

    const productDto = productItemToProductItemDto(product);
    return this.productsRepository
      .updateOne(productDto)
      .pipe(map(productItemDtoToProductItem));
  }

  deleteOne(id: string): Observable<void> {
    return this.productsRepository.deleteOne(id);
  }
}

function fromDDMMYYYYTOYYYYMMDD(date: string): string {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
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

function productItemToProductItemDto(productItem: ProductItem): ProductItemDto {
  return {
    id: productItem.id,
    name: productItem.name,
    description: productItem.description,
    logo: productItem.logo,
    date_release: productItem.dateRelease,
    date_revision: productItem.dateRevision,
  };
}
