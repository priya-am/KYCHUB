import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-compare-products',
  standalone: false,  
  templateUrl: './compare-products.component.html',
  styleUrls: ['./compare-products.component.scss']
})
export class CompareProductsComponent implements OnInit {
  comparedProducts: Product[] = [];
  allProducts: Product[] = [];
  isModalVisible = false;
  loading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.compareProducts$.subscribe(products => {
      this.comparedProducts = products;
      console.log(products);
      
    });
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe(response => {
      this.allProducts = response.products.map(product => ({
        ...product,
        isCompared: this.isProductCompared(product.id)
      }));
      this.loading = false;
    });
  }

  isProductCompared(productId: number): boolean {
    return this.comparedProducts.some(product => product.id === productId);
  }

  removeProduct(productId: number): void {
    this.productService.removeFromCompare(productId);
  }

  showModal(): void {
    this.loadAllProducts();
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  addToCompare(product: Product): void {
    this.productService.addToCompare(product);
    product.isCompared = true;
  }

  getCompareFeatures(): string[] {
    return ['brand', 'category', 'price', 'discountPercentage', 'rating', 'stock'];
  }

  getFeatureLabel(feature: string): string {
    const labels: {[key: string]: string} = {
      'brand': 'Brand',
      'category': 'Category',
      'price': 'Price ($)',
      'discountPercentage': 'Discount (%)',
      'rating': 'Rating',
      'stock': 'Stock'
    };
    return labels[feature] || feature;
  }

  getFeatureValue(product: Product, feature: string): any {
    return product[feature as keyof Product];
  }
}
