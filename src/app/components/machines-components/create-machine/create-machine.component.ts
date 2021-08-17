import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Machine } from 'src/app/model/machine';
import { MachinesService } from 'src/app/services/machines-service/machines.service';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css'],
})
export class CreateMachineComponent implements OnInit, OnDestroy {
  createMachineForm: FormGroup;
  private subscriptions: Subscription[] = [];
  machine: Machine;

  constructor(
    private formBuilder: FormBuilder,
    private machineService: MachinesService
  ) {}

  ngOnInit(): void {
    this.machine = new Machine();
    this.createMachineForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      productionYear: ['', [Validators.required]],
      serialNumber: ['', [Validators.required]],
      price: ['', [Validators.required]],
      imgUrl: ['', [Validators.required]],
    });
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.machine)) {
      AppUtil.showWarningMessage(
        `cannot create machine because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.machineService.create(this.machine).subscribe(
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
