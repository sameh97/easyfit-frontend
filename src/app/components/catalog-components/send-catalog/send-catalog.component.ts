import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppUtil } from 'src/app/common/app-util';
import { Catalog } from 'src/app/model/catalog';
import { CatalogService } from 'src/app/services/catalog-service/catalog.service';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-send-catalog',
  templateUrl: './send-catalog.component.html',
  styleUrls: ['./send-catalog.component.css'],
})
export class SendCatalogComponent implements OnInit, OnDestroy {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  sendCatalogForm: FormGroup;
  private subscriptions: Subscription[] = [];
  phones: string[] = [];
  message: string;
  constructor(
    private formBuilder: FormBuilder,
    private catalogService: CatalogService,
    @Inject(MAT_DIALOG_DATA) private catalog: Catalog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.catalogService.getAllPhones().subscribe((phones) => {
        this.phones = phones;
        this.message = '';
        this.buildForm();
      })
    );
  }

  private buildForm = (): void => {
    this.sendCatalogForm = this.formBuilder.group({
      message: [this.message, [Validators.required]],
      phones: [this.phones, [Validators.required]],
    });
  };

  public send = (): Promise<void> => {
    if (!AppUtil.hasValue(this.message)) {
      AppUtil.showWarningMessage(
        `cannot send message because there is a missing fields`
      );
      return;
    }

    const israeliNumberPrefix: string = `+972`;

    for (let i = 0; i < this.phones.length; i++) {
      this.phones[i] = this.phones[i].substring(1);
      this.phones[i] = `${israeliNumberPrefix}${this.phones[i]}`;
    }

    const messageContent: any = {
      message: `${this.message} Open the Link: ${this.getLink()}`,
      phones: this.phones,
    };

    this.subscriptions.push(
      this.catalogService.send(messageContent).subscribe()
    );
  };

  public getLink = (): string => {
    const link = `http://localhost:3000/api/catalog-url/${this.catalog.uuid}`;
    return link;
  };

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.phones.push(value);
    }

    // Clear the input value
    //TODO: event.chipInput!.clear();
  }

  remove(number: string): void {
    const index = this.phones.indexOf(number);

    if (index >= 0) {
      this.phones.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
