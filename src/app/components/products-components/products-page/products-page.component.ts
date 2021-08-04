import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { Product } from 'src/app/model/product';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products-service/products.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { tap } from 'rxjs/operators';
import { UpdateProductPageComponent } from '../update-product-page/update-product-page.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  products: Product[];
  private subscriptions: Subscription[] = [];

  constructor(
    private productsService: ProductsService,
    private navigationService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getAll().subscribe((products) => {
        this.products = products;
      })
    );
  }

  public getCategory(categoryID: any) {
    if (categoryID === 1) {
      return 'protein';
    } else if (categoryID === 2) {
      return 'BCAA';
    } else if (categoryID === 3) {
      return 'Glutamine';
    } else if (categoryID === 4) {
      return 'Creatine';
    } else if (categoryID === 5) {
      return 'Clothes';
    }
    //TODO: make more categores
  }

  public openUpdateProductDialog(product: Product) {
    this.subscriptions.push(
      this.navigationService
        .openDialog(UpdateProductPageComponent, null, product, null)
        .subscribe()
    );
  }

  public openCreateProductDialog() {
    this.subscriptions.push(
      this.navigationService.openDialog(AddProductComponent).subscribe()
    );
  }

  public delete = (product: Product) => {
    const message = `Are you sure you want to delete the product with the name:
    ${product.name}?`;

    this.navigationService
      .openYesNoDialogNoCallback(message, 500)
      .subscribe((res) => {
        if (res) {
          this.productsService.delete(product.id).subscribe(
            (res) => {
              console.log(res);
            },
            (err) => {
              AppUtil.showError(err);
            }
          );
        }
      });
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
