import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Machine } from 'src/app/model/machine';
import { MachinesService } from 'src/app/services/machines-service/machines.service';

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.css'],
})
export class EditMachineComponent implements OnInit, OnDestroy {
  updateMachineForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private machine: Machine,
    private machinesService: MachinesService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateMachineForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      id: [this.machine.id, [Validators.required]],
      name: [this.machine.name, [Validators.required]],
      description: [this.machine.description, [Validators.required]],
      productionYear: [this.machine.productionYear, [Validators.required]],
      serialNumber: [this.machine.serialNumber, [Validators.required]],
      price: [this.machine.price, [Validators.required]],
      imgUrl: [this.machine.imgUrl, [Validators.required]],
      gymId: [this.machine.gymId, [Validators.required]],
    });
  };
  // public supplierName?: string;
  // public productionCompany?: string;
  // public type?: string; //TODO: remove if there are not necessary

  public update = (machine: Machine): Promise<void> => {
    if (!AppUtil.hasValue(machine)) {
      AppUtil.showWarningMessage(
        `cannot update machine because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(this.machinesService.update(machine).subscribe());
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
