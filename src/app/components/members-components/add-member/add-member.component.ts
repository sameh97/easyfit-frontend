import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { FileUploadService } from 'src/app/services/file-upload-service/file-upload.service';
import { MembersService } from 'src/app/services/members-service/members.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements OnInit, OnDestroy {
  addMemberForm: FormGroup;
  member: Member;
  private subscriptions: Subscription[] = [];
  imageToUpload: File = null;
  uploadedImageUrl = null;

  constructor(
    private formBuilder: FormBuilder,
    private membersService: MembersService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.member = new Member();
    this.addMemberForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      joinDate: ['', [Validators.required]],
      endOfMembershipDate: ['', [Validators.required]],
      gender: [Validators.required],
      phone: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      birthDay: ['', [Validators.required]],
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
    // if (!AppUtil.hasValue(this.member.imageURL)) {
    //   this.addImgUrl();
    // }

    // TODO: make more validations

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
        .subscribe()
    );
  };

  public handleSelectedImage(files: FileList) {
    this.imageToUpload = files.item(0);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  //TODO: change with icon
  private addImgUrl() {
    this.member.imageURL =
      'https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-05/64/fitness-trainer-black-male-512.png';
  }
}
