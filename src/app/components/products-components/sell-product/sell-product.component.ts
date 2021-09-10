import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Bill } from 'src/app/model/bill';
import { Product } from 'src/app/model/product';
import { ProductsService } from 'src/app/services/products-service/products.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-sell-product',
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.css'],
})
export class SellProductComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  sellProductForm: FormGroup;
  bill: Bill;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private product: Product,
    private productsService: ProductsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.bill = new Bill();
    this.bill.gymId = this.product.gymId;
    this.bill.productID = this.product.id;
    this.buildForm();
    this.bill.quantity = 1;
    this.bill.totalCost = this.product.price * this.bill.quantity;
  }

  private buildForm = (): void => {
    this.sellProductForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      quantity: ['', [Validators.required, this.nonZero]],
      coustomerName: ['', [Validators.required, this.validateName]],
      coustomerPhone: ['', [Validators.required, this.validatePhoneNumber]],
      coustomerID: ['', [Validators.required, this.validateID]],
    });
  };

  public sellProduct = (): Promise<void> => {
    if (!AppUtil.hasValue(this.bill)) {
      AppUtil.showWarningMessage(
        `cannot sell product because there is a missing fields`
      );
      return;
    }
    this.bill.totalCost = this.product.price * this.bill.quantity;
    this.bill.productName = this.product.name;

    this.subscriptions.push(
      this.productsService.sell(this.bill).subscribe(
        (res) => {},
        (error) => {
          AppUtil.showError(error);
        }
      )
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
