import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { ProductListPageComponent } from './product-list-page.component';
import { ProductsService } from '../../../domain/services/products-service';
import { ProductMother } from '../../../domain/mothers';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let productsService: any;

  beforeEach(() => {
    productsService = jasmine.createSpyObj(['getAll', 'deleteOne']);
    TestBed.configureTestingModule({
      declarations: [ProductListPageComponent],
      providers: [
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    });
  });

  it('should create', () => {
    productsService.getAll.and.returnValue(of([]));
    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set the default values', waitForAsync(() => {
    productsService.getAll.and.returnValue(of([ProductMother.random()]));
    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // The initial page size is 5
    component.pageSize$.subscribe((pageSize) => {
      expect(pageSize).toBe(5);
    });

    // The initial page is 1
    component.currentPage$.subscribe((currentPage) => {
      expect(currentPage).toBe(1);
    });

    // The initial total pages is 1
    component.totalPages$.subscribe((totalPages) => {
      expect(totalPages).toBe(1);
    });
  }));

  it('should render the list of products', waitForAsync(() => {
    const products = ProductMother.randomList(7);
    productsService.getAll.and.returnValue(of(products));

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // All products (total)
    component.allProducts$.subscribe((products) => {
      expect(products.length).toBe(7);
    });

    // Page products (5 per page)
    component.pageProducts$.subscribe((products) => {
      expect(products.length).toBe(5);
    });
  }));

  it('should filter the products by name', waitForAsync(async () => {
    const firstProduct = ProductMother.random();
    firstProduct.name = 'First';
    const secondProduct = ProductMother.random();
    secondProduct.name = 'Second';

    productsService.getAll.and.returnValue(of([firstProduct, secondProduct]));
    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchValue$.next('First');

    // Only the first product should be returned
    const pageProducts = await firstValueFrom(component.pageProducts$);
    expect(pageProducts.length).toBe(1);
  }));

  it('should calculate the total pages', waitForAsync(async () => {
    const products = ProductMother.randomList(12);
    productsService.getAll.and.returnValue(of(products));

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Initial total pages is 3 (5 per page)
    const firstTotalPages = await firstValueFrom(component.totalPages$);
    expect(firstTotalPages).toBe(3);

    component.pageSize$.next(10);

    // Total pages is 2 (10 per page)
    component.totalPages$.subscribe((totalPages) => {
      expect(totalPages).toBe(2);
    });
  }));

  it('should change the page products when next or previous page is clicked', waitForAsync(async () => {
    const products = ProductMother.randomList(7);
    productsService.getAll.and.returnValue(of(products));

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Initial products (page 1)
    const products1 = await firstValueFrom(component.pageProducts$);
    expect(products1.length).toBe(5);

    component.onNextPage();

    // Next page products (page 2)
    const products2 = await firstValueFrom(component.pageProducts$);
    expect(products2.length).toBe(2);

    component.onPreviousPage();

    // Previous page products (page 1)
    const products3 = await firstValueFrom(component.pageProducts$);
    expect(products3.length).toBe(5);
  }));

  it('should call the get products method from products service', () => {
    const products = [ProductMother.random()];
    productsService.getAll.and.returnValue(of(products));
    productsService.deleteOne.and.returnValue(of(null));

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(productsService.getAll).toHaveBeenCalled();
  });

  it('should call the delete method from products service', () => {
    const product = ProductMother.random();
    productsService.getAll.and.returnValue(of([product]));
    productsService.deleteOne.and.returnValue(of(null));

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.deleteProduct(product.id);

    expect(productsService.deleteOne).toHaveBeenCalledWith(product.id);
  });
});
