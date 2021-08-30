import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Product } from 'src/app/model/product';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { ProductsService } from 'src/app/services/products-service/products.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  addProductForm: FormGroup;
  product: Product;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private fileUploadService: FileUploadService
  ) {
    super();
  }

  ngOnInit(): void {
    this.product = new Product();
    this.addProductForm = this.formBuilder.group({
      // TODO: make the validators more relevant:

      name: ['', [Validators.required, this.validateProductName]],
      price: ['', [Validators.required, Validators.min(0), this.validatePrice]],
      description: ['', [Validators.required]],
      code: ['', [Validators.required, this.validateProductCode]],
      quantity: ['', [Validators.compose([Validators.required, this.nonZero])]],
      imgUrl: ['', [Validators.required]],
      categoryID: ['', [Validators.required]],
    });
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.product)) {
      AppUtil.showWarningMessage(
        `cannot create product because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, null)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            this.product.imgUrl = imgUrl;
            return this.productsService.create(this.product);
          })
        )
        .subscribe(
          (product) => {
            this.dialogRef.close();
          },
          (err: Error) => {
            AppUtil.showError(err);
          }
        )
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
