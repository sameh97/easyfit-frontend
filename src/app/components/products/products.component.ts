import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductsService } from 'src/app/services/products-service/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.getAll();
  }

  public getAll = (): Observable<Product[]> => {
    return this.productsService.getAll();
  };
}
