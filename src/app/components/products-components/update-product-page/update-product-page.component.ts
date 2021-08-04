import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Product } from 'src/app/model/product';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { ProductsService } from 'src/app/services/products-service/products.service';
@Component({
  selector: 'app-update-product-page',
  templateUrl: './update-product-page.component.html',
  styleUrls: ['./update-product-page.component.css'],
})
export class UpdateProductPageComponent implements OnInit, OnDestroy {
  updateProductForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private product: Product,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateProductForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      id: [this.product.id, [Validators.required]],
      name: [this.product.name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      code: [this.product.code, [Validators.required]],
      quantity: [
        this.product.quantity,
        [Validators.compose([Validators.required, this.nonZero])],
      ],
      imgUrl: [this.product.imgUrl, [Validators.required]],
      categoryID: [this.product.categoryID, [Validators.required]],
      gymId: [this.product.gymId, [Validators.required]],
    });
  };

  public nonZero(control: AbstractControl): { [key: string]: any } {
    if (Number(control.value) < 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }

  public update = (product: Product): Promise<void> => {
    if (!AppUtil.hasValue(product)) {
      AppUtil.showWarningMessage(
        `cannot update product because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(this.productsService.update(product).subscribe());
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
