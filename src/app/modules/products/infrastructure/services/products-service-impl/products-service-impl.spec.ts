import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { ProductsServiceImpl } from '.';
import { ProductsRepository } from '../../../domain/repositories/products-repository';

describe('ProductsService', () => {
  let service: ProductsServiceImpl;
  let productsRepository: any;

  beforeEach(() => {
    productsRepository = jasmine.createSpyObj(['getAll']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductsRepository,
          useValue: productsRepository,
        },
      ],
    });
    service = TestBed.inject(ProductsServiceImpl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse the ProductItemDto to ProductItem', async () => {
    productsRepository.getAll.and.returnValue(
      of([
        {
          id: '1',
          name: 'name',
          description: 'description',
          logo: 'logo',
          date_release: '2023-02-01',
          date_revision: '2023-02-01',
        },
      ]),
    );
    const result = await firstValueFrom(service.getAll());
    expect(result).toEqual([
      {
        id: '1',
        name: 'name',
        description: 'description',
        logo: 'logo',
        dateRelease: '2023-02-01',
        dateRevision: '2023-02-01',
      },
    ]);
  });
});
