import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListPageComponent } from './modules/products/presentation/pages/product-list-page/product-list-page.component';
import { AddProductPageComponent } from './modules/products/presentation/pages/add-product-page/add-product-page.component';
import { EditProductPageComponent } from './modules/products/presentation/pages/edit-product-page/edit-product-page.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListPageComponent,
  },
  {
    path: 'add',
    component: AddProductPageComponent,
  },
  {
    path: 'edit/:id',
    component: EditProductPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
