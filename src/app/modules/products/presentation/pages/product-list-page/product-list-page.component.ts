import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';

import { ProductsService } from '../../../domain/services/products-service';
import { ProductItem } from '../../../domain/models/product';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.css'],
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  allProducts$ = this.productsService.getAll();
  searchValue$ = new BehaviorSubject('');
  currentPage$ = new BehaviorSubject(1);
  totalPages$: Observable<number> = of(0);
  pageSize$ = new BehaviorSubject(5);
  pageProducts$: Observable<ProductItem[]> = of([]);
  subscriptions: Subscription[] = [];

  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    const searchValue$ = this.searchValue$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    );

    const productsOrSearchValueChange$ = combineLatest([
      this.allProducts$,
      searchValue$,
    ]);

    this.subscriptions.push(
      productsOrSearchValueChange$.subscribe(() => {
        this.currentPage$.next(1);
      }),
    );

    const filteredProducts$ = productsOrSearchValueChange$.pipe(
      map(([products, searchValue]) => {
        return products.filter((product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase()),
        );
      }),
    );

    this.pageProducts$ = combineLatest([
      filteredProducts$,
      this.currentPage$,
      this.pageSize$,
    ]).pipe(
      map(([filteredProducts, page, pageSize]) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredProducts.slice(startIndex, endIndex);
      }),
    );

    this.totalPages$ = combineLatest([filteredProducts$, this.pageSize$]).pipe(
      map(([products, pageSize]) => Math.ceil(products.length / pageSize)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onInput(value: string) {
    this.searchValue$.next(value);
  }

  onNextPage() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  onPreviousPage() {
    this.currentPage$.next(this.currentPage$.value - 1);
  }

  onPageSizeChange(pageSize: string) {
    this.pageSize$.next(Number(pageSize));
  }
}
