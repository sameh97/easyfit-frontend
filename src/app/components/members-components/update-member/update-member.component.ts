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
import { Member } from 'src/app/model/member';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { MembersService } from 'src/app/services/members-service/members.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.css'],
})
export class UpdateMemberComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  updateMemberForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private membersService: MembersService,
    @Inject(MAT_DIALOG_DATA) private member: Member,
    private fileUploadService: FileUploadService,
    public dialogRef: MatDialogRef<UpdateMemberComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateMemberForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      firstName: [
        this.member.firstName,
        [Validators.required, Validators.minLength(3), this.validateName],
      ],
      lastName: [
        this.member.lastName,
        [Validators.required, this.validateName],
      ],
      email: [this.member.email, [Validators.required, Validators.email]],
      joinDate: [this.member.joinDate, [Validators.required]],
      endOfMembershipDate: [
        this.member.endOfMembershipDate,
        [Validators.required, , this.checkDate],
      ],
      phone: [
        this.member.phone,
        [Validators.required, this.validatePhoneNumber],
      ],
      address: [this.member.address, [Validators.required]],
      gender: [this.member.gender, Validators.required],
      birthDay: [
        this.member.birthDay,
        [Validators.required, , this.validateBirthDay],
      ],
      imageURL: [this.member.imageURL],
    });
  };

  public update = (member: Member): Promise<void> => {
    if (!AppUtil.hasValue(member)) {
      AppUtil.showWarningMessage(
        `cannot update member because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, this.member.imageURL)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            member.imageURL = imgUrl;
            return this.membersService.update(member);
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
    return this.updateMemberForm.controls;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
