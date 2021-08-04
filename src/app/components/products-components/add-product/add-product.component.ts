import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Product } from 'src/app/model/product';
import { ProductsService } from 'src/app/services/products-service/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  addProductForm: FormGroup;
  product: Product;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.product = new Product();
    this.addProductForm = this.formBuilder.group({
      // TODO: make the validators more relevant:

      name: [this.product.name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      code: [this.product.code, [Validators.required]],
      quantity: [
        this.product.quantity,
        [Validators.compose([Validators.required, this.nonZero])],
      ],
      imgUrl: [this.product.imgUrl, [Validators.required]],
      categoryID: [this.product.categoryID, [Validators.required]],
    });
  }

  public nonZero(control: AbstractControl): { [key: string]: any } {
    if (Number(control.value) < 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.product)) {
      AppUtil.showWarningMessage(
        `cannot create product because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.productsService.create(this.product).subscribe(
        () => {},
        (err: Error) => {
          //TODO:  display an appropriate message in the UI
          AppUtil.showError(err);
        }
      )
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
