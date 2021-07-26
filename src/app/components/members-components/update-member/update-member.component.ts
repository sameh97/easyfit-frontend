import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';

@Component({
  selector: 'app-update-member',
  templateUrl: './update-member.component.html',
  styleUrls: ['./update-member.component.css'],
})
export class UpdateMemberComponent implements OnInit, OnDestroy {
  updateMemberForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private membersService: MembersService,
    @Inject(MAT_DIALOG_DATA) private member: Member
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateMemberForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      firstName: [
        this.member.firstName,
        [Validators.required, Validators.minLength(3)],
      ],
      lastName: [this.member.lastName, [Validators.required]],
      email: [this.member.email, [Validators.required, Validators.email]],
      joinDate: [this.member.joinDate, [Validators.required]],
      endOfMembershipDate: [
        this.member.endOfMembershipDate,
        [Validators.required],
      ],
      phone: [
        this.member.phone,
        [Validators.required, Validators.minLength(4)],
      ],
      address: [
        this.member.address,
        [Validators.required, Validators.minLength(3)],
      ],
      birthDay: [this.member.birthDay, [Validators.required]],
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

    this.subscriptions.push(this.membersService.update(member).subscribe());
  };

  get form(): { [key: string]: AbstractControl } {
    return this.updateMemberForm.controls;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}