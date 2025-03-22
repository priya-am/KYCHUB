
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private compareProductsSubject = new BehaviorSubject<Product[]>([]);
  public compareProducts$ = this.compareProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl);
  }

  
  addToCompare(product: Product): void {
    const currentProducts = this.compareProductsSubject.getValue();
    if (currentProducts.length < 4 && !currentProducts.some(p => p.id === product.id)) {
      const updatedProducts = [...currentProducts, { ...product, isCompared: true }];
      this.compareProductsSubject.next(updatedProducts);
    }
  }

  removeFromCompare(productId: number): void {
    const currentProducts = this.compareProductsSubject.getValue();
    const updatedProducts = currentProducts.filter(product => product.id !== productId);
    this.compareProductsSubject.next(updatedProducts);
  }

  isProductCompared(productId: number): boolean {
    const currentProducts = this.compareProductsSubject.getValue();
    return currentProducts.some(product => product.id === productId);
  }

  clearCompareList(): void {
    this.compareProductsSubject.next([]);
  }

  getComparedProducts(): Product[] {
    return this.compareProductsSubject.getValue();
  }
}
