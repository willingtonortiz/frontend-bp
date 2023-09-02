import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
} from 'rxjs';

import {
  dateFromDDMMYYYY,
  dateToDDMMYYYY,
  DateValidators,
} from '../../../../../shared/presentation/validators/date-validators';
import { ProductsService } from '../../../domain/services/products-service';
import { ProductItem } from '../../../domain/models/product';

type FormFields = {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  logo: FormControl<string | null>;
  dateRelease: FormControl<string | null>;
  dateRevision: FormControl<string | null>;
};

function idValidator(
  productsService: ProductsService,
  subscriptions: Subscription[],
): AsyncValidatorFn {
  const valueSubject = new BehaviorSubject('');
  const resultSubject = new BehaviorSubject<ValidationErrors | null>(null);
  subscriptions.push(
    valueSubject
      .asObservable()
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value) => productsService.checkIdExists(value)),
        map((isValid) => (isValid ? { invalid: true } : null)),
      )
      .subscribe((result) => resultSubject.next(result)),
  );

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.value === null) return of(null);
    valueSubject.next(control.value);
    return resultSubject.asObservable().pipe(take(2));
  };
}

@Component({
  selector: 'app-add-product-page',
  templateUrl: './add-product-page.component.html',
  styleUrls: ['./add-product-page.component.css'],
})
export class AddProductPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  type: 'add' | 'edit' = 'add';
  form: FormGroup<FormFields>;
  isSubmitting = false;

  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    // Building the form
    this.form = this.formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        idValidator(productsService, this.subscriptions),
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      dateRelease: [
        '',
        [
          Validators.required,
          DateValidators.dateFormatValidator,
          DateValidators.minDateValidator(new Date()),
        ],
      ],
      dateRevision: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // dateRevision field is one year after dateRelease field
    this.subscriptions.push(
      this.form.get('dateRelease')!.valueChanges.subscribe((value) => {
        if (this.form.get('dateRelease')?.invalid) return;

        const dateRelease = dateFromDDMMYYYY(value!);
        const dateRevision = this.addOneYear(dateRelease);
        this.form.get('dateRevision')?.setValue(dateToDDMMYYYY(dateRevision));
      }),
    );

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.type = 'edit';
      this.form.get('id')?.setValue(productId);
      this.form.get('id')?.disable();
      this.form.get('name')?.setValue('Product 1');
      this.form.get('description')?.setValue('Description 1');
      this.form.get('logo')?.setValue('Logo 1');
      this.form.get('dateRelease')?.setValue('01/01/2021');
      return;
    }

    const now = new Date();
    const dateRelease = dateToDDMMYYYY(now);
    this.form.get('dateRelease')?.setValue(dateRelease);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  addProduct() {
    if (this.form.invalid) return;
    const product = this.form.value as ProductItem;
    this.isSubmitting = true;
    this.productsService.addOne(product).subscribe((result) => {
      this.isSubmitting = false;
      this.router.navigate(['/']);
    });
  }

  restart() {
    this.form.reset();
  }

  private addOneYear(date: Date) {
    // Get the same day and month next year
    const nextYear = date.getFullYear() + 1;
    const day = date.getDate();
    const month = date.getMonth();
    return new Date(nextYear, month, day);
  }
}
