import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/presentation/components/button/button.component';
import { ProductListPageComponent } from './modules/products/presentation/pages/product-list-page/product-list-page.component';
import { AddProductPageComponent } from './modules/products/presentation/pages/add-product-page/add-product-page.component';
import { EditProductPageComponent } from './modules/products/presentation/pages/edit-product-page/edit-product-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ProductListPageComponent,
    AddProductPageComponent,
    EditProductPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
