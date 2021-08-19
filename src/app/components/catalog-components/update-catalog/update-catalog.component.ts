import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Catalog } from 'src/app/model/catalog';
import { CatalogService } from 'src/app/services/catalog-service/catalog.service';

@Component({
  selector: 'app-update-catalog',
  templateUrl: './update-catalog.component.html',
  styleUrls: ['./update-catalog.component.css'],
})
export class UpdateCatalogComponent implements OnInit, OnDestroy {
  updateCatalogForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private catalogService: CatalogService,
    @Inject(MAT_DIALOG_DATA) private catalog: Catalog
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateCatalogForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      durationDays: [
        this.catalog.durationDays,
        [Validators.required, Validators.min(1)],
      ],
      products: [this.catalog.products, [Validators.required]],
    });
  };

  public update = (catalog: Catalog): Promise<void> => {
    if (!AppUtil.hasValue(catalog)) {
      AppUtil.showWarningMessage(
        `cannot update catalog because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(this.catalogService.update(catalog).subscribe());
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
