import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Machine } from 'src/app/model/machine';
import { MachinesService } from 'src/app/services/machines-service/machines.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css'],
})
export class CreateMachineComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  createMachineForm: FormGroup;
  private subscriptions: Subscription[] = [];
  machine: Machine;

  constructor(
    private formBuilder: FormBuilder,
    private machineService: MachinesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.machine = new Machine();
    this.createMachineForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      name: ['', [Validators.required, this.validateMachineName]],
      description: ['', [Validators.required]],
      productionYear: ['', [Validators.required, this.validateYear]],
      serialNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          this.validateSerialNumber,
        ],
      ],
      price: [
        '',
        [Validators.required, Validators.min(0), this.validatePrice],
      ],
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
