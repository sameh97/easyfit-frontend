import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { MembersService } from 'src/app/services/members-service/members.service';
import { FormInputComponent } from 'src/app/shared/components/form-input/form-input.component';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent
  extends FormInputComponent
  implements OnInit, OnDestroy
{
  addMemberForm: FormGroup;
  member: Member;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private membersService: MembersService,
    private fileUploadService: FileUploadService,
    public dialogRef: MatDialogRef<AddMemberComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.member = new Member();
    this.addMemberForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      firstName: [
        '',
        [Validators.required, Validators.minLength(3), this.validateName],
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2), this.validateName],
      ],
      email: ['', [Validators.required, Validators.email]],
      joinDate: ['', [Validators.required]],
      endOfMembershipDate: ['', [Validators.required, this.checkDate]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, this.validatePhoneNumber]],
      address: ['', [Validators.required]],
      birthDay: ['', [Validators.required, this.validateBirthDay]],
      image: [''],
    });
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.member)) {
      AppUtil.showWarningMessage(
        `cannot create member because there is a missing fields`
      );
      return;
    }

    // // TODO: remove this link and isactive ... :
    // if (!AppUtil.hasValue(this.imageToUpload)) {
    //   this.addMemberAvatar();
    // }

    this.subscriptions.push(
      this.fileUploadService
        .uploadImage(this.imageToUpload, null)
        .pipe(
          switchMap((imgUrl) => {
            this.uploadedImageUrl = imgUrl;
            this.member.imageURL = imgUrl;
            return this.membersService.create(this.member);
          })
        )
        .subscribe(
          (member) => {
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

  //TODO: change with icon
  private addMemberAvatar() {
    this.member.imageURL =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0Ovwvg3qzdD37Gir30mn8nG5yra8TYzan0RL_rnONAvsAjUtamuE74TrjBZHpl9FH7g&usqp=CAU';
  }
}
