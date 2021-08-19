import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Catalog } from 'src/app/model/catalog';
import { Product } from 'src/app/model/product';
import { CatalogService } from 'src/app/services/catalog-service/catalog.service';
import { ProductsService } from 'src/app/services/products-service/products.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.css'],
})
export class AddCatalogComponent implements OnInit, OnDestroy {
  addCatalogForm: FormGroup;
  catalog: Catalog;
  allProducts: Product[];
  private subscriptions: Subscription[] = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private formBuilder: FormBuilder,
    private catalogService: CatalogService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getAll().subscribe((products) => {
        this.allProducts = products;
        // for (let product of this.allProducts) {
        //   const item: any = {
        //     item_id: product.id,
        //     item_text: product.name,
        //     id: product.id,
        //     name: product.name,
        //     description: product.description,
        //     code: product.code,
        //     quantity: product.quantity,
        //     imgUrl: product.imgUrl,
        //     categoryID: product.categoryID,
        //     gymId: product.gymId,
        //   };
        //   this.dropdownList.push(item);
        // }

        for (let product of this.allProducts) {
          const item: any = {
            item_id: product.id,
            item_text: product.name,
          };
          this.dropdownList.push(item);
        }

        this.dropdownList = [...this.dropdownList];
      })
    );

    this.catalog = new Catalog();
    this.addCatalogForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      durationDays: ['', [Validators.required, Validators.min(1)]],
      products: ['', [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {
    console.log(item);
    for (let product of this.allProducts) {
      if (item.item_id === product.id) {
        this.catalog.products.push(product);
      }
    }
  }
  onSelectAll(items: any) {
    console.log(items);
    for (let product of this.allProducts) {
      this.catalog.products.push(product);
    }
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.catalog)) {
      AppUtil.showWarningMessage(
        `cannot create catalog because there is a missing fields`
      );
      return;
    }

    this.catalog.isActive = true;

    this.subscriptions.push(
      this.catalogService.create(this.catalog).subscribe(
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