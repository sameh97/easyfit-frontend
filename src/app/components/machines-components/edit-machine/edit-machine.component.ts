import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Machine } from 'src/app/model/machine';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { MachinesService } from 'src/app/services/machines-service/machines.service';
import { UserNotificationsService } from 'src/app/services/user-notifications.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.css'],
})
export class EditMachineComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  updateMachineForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private machine: Machine,
    private machinesService: MachinesService,
    private fileUploadService: FileUploadService,
    private userNotificationsService: UserNotificationsService,
    public dialogRef: MatDialogRef<EditMachineComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    // TODO: delete all notifications for this machine if the serial number is changed, and cancel job
    this.updateMachineForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      id: [this.machine.id, [Validators.required]],
      name: [
        this.machine.name,
        [Validators.required, this.validateMachineName],
      ],
      description: [this.machine.description, [Validators.required]],
      productionYear: [
        this.machine.productionYear,
        [Validators.required, this.validateYear],
      ],
      serialNumber: [
        this.machine.serialNumber,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          this.validateSerialNumber,
        ],
      ],
      price: [
        this.machine.price,
        [Validators.required, Validators.min(0), this.validatePrice],
      ],
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

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, null)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            machine.imgUrl = imgUrl;
            return this.machinesService.update(machine);
          })
        )
        .subscribe(
          () => {
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
