import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AddProductPageComponent } from './add-product-page.component';
import { ProductsService } from '../../../domain/services/products-service';
import { dateToDDMMYYYY } from '../../../../../shared/presentation/validators/date-validators';
import { ProductMother } from '../../../domain/mothers';

describe('AddProductPageComponent', () => {
  let component: AddProductPageComponent;
  let fixture: ComponentFixture<AddProductPageComponent>;
  let productsService: any;

  describe('form validation', () => {
    beforeEach(() => {
      productsService = jasmine.createSpyObj(['checkIdExists', 'addOne']);
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, RouterTestingModule],
        declarations: [AddProductPageComponent],
        providers: [
          {
            provide: ProductsService,
            useValue: productsService,
          },
        ],
      });
    });

    it('should create', () => {
      productsService.checkIdExists.and.returnValue(of(true));
      fixture = TestBed.createComponent(AddProductPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component).toBeTruthy();

      // Default form values
      const dateReleaseControl = component.form.get('dateRelease');
      expect(dateReleaseControl?.hasError('required')).toBeFalse();
      const dateRevisionControl = component.form.get('dateRevision');
      expect(dateRevisionControl?.hasError('required')).toBeFalse();
      expect(component.form.invalid).toBeTrue();
    });

    describe('product id validation', () => {
      beforeEach(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be required', waitForAsync(() => {
        const idControl = component.form.get('id');
        idControl?.setValue('');
        expect(idControl?.hasError('required')).toBeTrue();
      }));

      it('should be equal or larger than 3 characters', () => {
        const idControl = component.form.get('id');
        idControl?.setValue('a'.repeat(2));
        expect(idControl?.hasError('minlength')).toBeTrue();
      });

      it('should be equal or smaller than 10 characters', () => {
        const idControl = component.form.get('id');
        idControl?.setValue('a'.repeat(11));
        expect(idControl?.hasError('maxlength')).toBeTrue();
      });

      it('should be available from server', (done) => {
        // True means that the id is not available (it exists)
        productsService.checkIdExists.and.returnValue(of(true));
        const idControl = component.form.get('id');
        idControl?.setValue('a'.repeat(3));

        // wait for 1 second
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
          expect(idControl?.hasError('invalid')).toBeTrue();
          done();
        });
      });
    });

    describe('product name validation', () => {
      beforeEach(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be required', waitForAsync(() => {
        const nameControl = component.form.get('name');
        nameControl?.setValue('');
        expect(nameControl?.hasError('required')).toBeTrue();
      }));

      it('should be equal or larger than 5 characters', () => {
        const nameControl = component.form.get('name');
        nameControl?.setValue('a'.repeat(4));
        expect(nameControl?.hasError('minlength')).toBeTrue();
      });

      it('should be equal or smaller than 100 characters', () => {
        const nameControl = component.form.get('name');
        nameControl?.setValue('a'.repeat(101));
        expect(nameControl?.hasError('maxlength')).toBeTrue();
      });
    });

    describe('product description validation', () => {
      beforeEach(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be required', waitForAsync(() => {
        const descriptionControl = component.form.get('description');
        descriptionControl?.setValue('');
        expect(descriptionControl?.hasError('required')).toBeTrue();
      }));

      it('should be equal or larger than 10 characters', () => {
        const descriptionControl = component.form.get('description');
        descriptionControl?.setValue('a'.repeat(9));
        expect(descriptionControl?.hasError('minlength')).toBeTrue();
      });

      it('should be equal or smaller than 200 characters', () => {
        const descriptionControl = component.form.get('description');
        descriptionControl?.setValue('a'.repeat(201));
        expect(descriptionControl?.hasError('maxlength')).toBeTrue();
      });
    });

    describe('product logo validation', () => {
      it('should be required', waitForAsync(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const logoControl = component.form.get('logo');
        logoControl?.setValue('');
        expect(logoControl?.hasError('required')).toBeTrue();
      }));
    });

    describe('product dateRelease validation', () => {
      beforeEach(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should be required', waitForAsync(() => {
        const dateReleaseControl = component.form.get('dateRelease');
        dateReleaseControl?.setValue('');
        expect(dateReleaseControl?.hasError('required')).toBeTrue();
      }));

      it('should have a valid date format', () => {
        const dateReleaseControl = component.form.get('dateRelease');
        dateReleaseControl?.setValue('01/01/2021');
        expect(dateReleaseControl?.hasError('dateFormat')).toBeFalse();
      });

      it('should be equal or after today', () => {
        const dateReleaseControl = component.form.get('dateRelease');
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        const lastYearStr = dateToDDMMYYYY(lastYear);
        dateReleaseControl?.setValue(lastYearStr);
        expect(dateReleaseControl?.hasError('minDate')).toBeTrue();
      });
    });

    describe('product dateRevision validation', () => {
      it('should be required', waitForAsync(() => {
        productsService.checkIdExists.and.returnValue(of(true));
        fixture = TestBed.createComponent(AddProductPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const dateRelease = component.form.get('dateRevision');
        dateRelease?.setValue('');
        expect(dateRelease?.hasError('required')).toBeTrue();
      }));
    });
  });

  describe('add product', () => {
    beforeEach(() => {
      productsService = jasmine.createSpyObj(['checkIdExists', 'addOne']);
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, RouterTestingModule],
        declarations: [AddProductPageComponent],
        providers: [
          {
            provide: ProductsService,
            useValue: productsService,
          },
        ],
      });

      // To simulate the '/add' route
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

      productsService.checkIdExists.and.returnValue(of(false));
      productsService.addOne.and.returnValue(of({} as any));

      fixture = TestBed.createComponent(AddProductPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Valid form values
      const idControl = component.form.get('id');
      idControl?.setValue('a'.repeat(3));
      const nameControl = component.form.get('name');
      nameControl?.setValue('a'.repeat(5));
      const descriptionControl = component.form.get('description');
      descriptionControl?.setValue('a'.repeat(10));
      const logoControl = component.form.get('logo');
      logoControl?.setValue('a'.repeat(5));
    });

    it("should have the type 'add'", () => {
      expect(component.type).toBe('add');
    });

    it('should be valid when all fields are valid', (done) => {
      // wait for 1 second
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        expect(component.form.valid).toBeTrue();
        expect(component.form.invalid).toBeFalse();
        done();
      });
    });

    it('should call the products service', (done) => {
      // wait for 1 second
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        component.addOrEditProduct();
        expect(productsService.addOne).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('edit product', () => {
    let product = ProductMother.random();

    beforeEach(() => {
      productsService = jasmine.createSpyObj(['getOne', 'updateOne']);
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
        declarations: [AddProductPageComponent],
        providers: [
          {
            provide: ProductsService,
            useValue: productsService,
          },
        ],
      });

      // To simulate the '/edit/:productId' route
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.paramMap, 'get').and.returnValue(product.id);

      productsService.getOne.and.returnValue(of(product));
      productsService.updateOne.and.returnValue(of(product));

      fixture = TestBed.createComponent(AddProductPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should have the type 'edit'", () => {
      expect(component.type).toBe('edit');
    });

    it('should call the products service', () => {
      expect(productsService.getOne).toHaveBeenCalled();

      component.addOrEditProduct();
      expect(productsService.updateOne).toHaveBeenCalled();
    });
  });
});
