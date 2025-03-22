
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { NzTableSortOrder } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  products: Product[] = [];
  displayProducts: Product[] = []; 
  loading = true;
  compareList: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.productService.compareProducts$.subscribe(products => {
      this.compareList = products;
      
      this.updateProductsCompareStatus();
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(response => {
      this.products = response.products.map(product => ({
        ...product,
        isCompared: this.isInCompareList(product.id)
      }));
      this.displayProducts = [...this.products]; 
      this.loading = false;
    });
  }
    
  updateProductsCompareStatus(): void {
    this.products = this.products.map(product => ({
      ...product,
      isCompared: this.isInCompareList(product.id)
    }));
    this.displayProducts = [...this.products]; 
  }

  addToCompare(product: Product): void {
    this.productService.addToCompare(product);
  }

  isInCompareList(productId: number): boolean {
    return this.compareList.some(product => product.id === productId);
  }

  goToCompare(): void {
    this.router.navigate(['/compare-products']);
  }
  
  
  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log('Query params changed:', params);
    const { sort, pageIndex, pageSize } = params;
    const currentSort = sort.find(item => item.value !== null);
    
    if (currentSort) {
      const sortField = currentSort.key;
      const sortOrder = currentSort.value;
      
      console.log(`Sorting by ${sortField} in ${sortOrder} order`);
      
      
      this.displayProducts = [...this.products].sort((a, b) => {
        const isAsc = sortOrder === 'ascend';
        
        switch (sortField) {
          case 'title':
            return this.compareString(a.title, b.title, isAsc);
          case 'brand':
           
            const brandA = String(a.brand || '');
            const brandB = String(b.brand || '');
            console.log(`Comparing brands: "${brandA}" vs "${brandB}"`);
            return this.compareString(brandA, brandB, isAsc);
          case 'category':
            return this.compareString(a.category, b.category, isAsc);
          case 'price':
            return this.compareNumber(a.price, b.price, isAsc);
          case 'discountPercentage':
            return this.compareNumber(a.discountPercentage, b.discountPercentage, isAsc);
          default:
            return 0;
        }
      });
    } else {
      
      this.displayProducts = [...this.products];
    }
  }
  
  
  compareString(a: string, b: string, isAsc: boolean): number {
   
    if (!a) a = '';
    if (!b) b = '';
    
    return isAsc ? a.localeCompare(b) : b.localeCompare(a);
  }
  
  compareNumber(a: number, b: number, isAsc: boolean): number {
    
    if (a === null || a === undefined) a = 0;
    if (b === null || b === undefined) b = 0;
    
    return isAsc ? a - b : b - a;
  }
}