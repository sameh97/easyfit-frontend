import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Product } from 'src/app/model/product';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { ProductsService } from 'src/app/services/products-service/products.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';
@Component({
  selector: 'app-update-product-page',
  templateUrl: './update-product-page.component.html',
  styleUrls: ['./update-product-page.component.css'],
})
export class UpdateProductPageComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  updateProductForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private product: Product,
    private productsService: ProductsService,
    private fileUploadService: FileUploadService,
    public dialogRef: MatDialogRef<UpdateProductPageComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateProductForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      id: [this.product.id, [Validators.required]],
      price: [
        this.product.price,
        [Validators.required, Validators.min(0), this.validatePrice],
      ],
      name: [
        this.product.name,
        [Validators.required, this.validateProductName],
      ],
      description: [this.product.description, [Validators.required]],
      code: [
        this.product.code,
        [Validators.required, this.validateProductCode],
      ],
      quantity: [
        this.product.quantity,
        [Validators.compose([Validators.required, this.nonZero])],
      ],
      imgUrl: [this.product.imgUrl, [Validators.required]],
      categoryID: [this.product.categoryID, [Validators.required]],
      gymId: [this.product.gymId, [Validators.required]],
    });
  };

  public update = (product: Product): Promise<void> => {
    if (!AppUtil.hasValue(product)) {
      AppUtil.showWarningMessage(
        `cannot update product because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, this.product.imgUrl)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            product.imgUrl = imgUrl;
            return this.productsService.update(product);
          })
        )
        .subscribe(
          () => {
            this.dialogRef.close();
          },
          (error: Error) => {
            AppUtil.showError(error);
          }
        )
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
