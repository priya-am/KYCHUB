import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-navbar',
  standalone: false,  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  comparedProductsCount = 0;

  constructor(private productService: ProductService) {
    this.productService.compareProducts$.subscribe(products => {
      this.comparedProductsCount = products.length;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}