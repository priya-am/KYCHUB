import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CompareProductsComponent } from './components/compare-products/compare-products.component';

const routes: Routes = [
  { path: '', redirectTo: 'product-details', pathMatch: 'full' },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'compare-products', component: CompareProductsComponent },
  { path: '**', redirectTo: 'product-details' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }