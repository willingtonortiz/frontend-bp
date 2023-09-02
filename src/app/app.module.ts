import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/presentation/components/button/button.component';
import {
  ProductListPageComponent,
  AddProductPageComponent,
} from './modules/products/presentation/pages';
import { HeaderComponent } from './shared/presentation/components/header/header.component';
import { HttpProductsRepository } from './modules/products/infrastructure/repositories/http-products-repository';
import { ProductsRepository } from './modules/products/domain/repositories/products-repository';
import { ProductsService } from './modules/products/domain/services/products-service';
import { ProductsServiceImpl } from './modules/products/infrastructure/services/products-service-impl';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    ButtonComponent,
    ProductListPageComponent,
    AddProductPageComponent,
    HeaderComponent,
  ],
  providers: [
    {
      provide: ProductsRepository,
      useClass: HttpProductsRepository,
    },
    {
      provide: ProductsService,
      useClass: ProductsServiceImpl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
