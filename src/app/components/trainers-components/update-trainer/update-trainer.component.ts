import { Component, Inject, OnInit } from '@angular/core';
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
import { Trainer } from 'src/app/model/trainer';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';
import { TrainersService } from './../../../services/trainers-service/trainers.service';

@Component({
  selector: 'app-update-trainer',
  templateUrl: './update-trainer.component.html',
  styleUrls: ['./update-trainer.component.css'],
})
export class UpdateTrainerComponent
  extends FormInputComponent
  implements OnInit
{
  updateTrainerForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private trainerService: TrainersService,
    @Inject(MAT_DIALOG_DATA) private trainer: Trainer,
    public dialogRef: MatDialogRef<UpdateTrainerComponent>,
    private fileUploadService: FileUploadService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateTrainerForm = this.formBuilder.group({
      firstName: [
        this.trainer.firstName,
        [Validators.required, Validators.minLength(3)],
      ],

      lastName: [this.trainer.lastName, [Validators.required]],
      email: [this.trainer.email, [Validators.required, Validators.email]],
      joinDate: [this.trainer.joinDate, [Validators.required]],
      certificationDate: [
        this.trainer.certificationDate,
        [Validators.required],
      ],
      phone: [
        this.trainer.phone,
        [Validators.required, Validators.minLength(4)],
      ],
      address: [
        this.trainer.address,
        [Validators.required, Validators.minLength(3)],
      ],
      gender: [this.trainer.gender, Validators.required],
      birthDay: [this.trainer.birthDay, [Validators.required]],
      imageURL: [this.trainer.imageURL, [Validators.required]],
    });
  };

  public update = (trainer: Trainer): Promise<void> => {
    if (!AppUtil.hasValue(trainer)) {
      AppUtil.showWarningMessage(
        `cannot update trainer because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, this.trainer.imageURL)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            trainer.imageURL = imgUrl;
            return this.trainerService.update(trainer);
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

  get form(): { [key: string]: AbstractControl } {
    return this.updateTrainerForm.controls;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
