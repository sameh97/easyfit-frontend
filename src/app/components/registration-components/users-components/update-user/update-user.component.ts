import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Gym } from 'src/app/model/gym';
import { User } from 'src/app/model/user';
import { GymsService } from 'src/app/services/gyms-service/gyms.service';
import { UsersService } from 'src/app/services/users-service/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  updateUserForm: FormGroup;
  private subscriptions: Subscription[] = [];
  gyms: Gym[];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private user: User,
    private gymsService: GymsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.gymsService.getAll().subscribe((gyms) => {
        this.gyms = gyms;

        for (let gym of this.gyms) {
          const item: any = {
            item_id: gym.id,
            item_text: gym.name,
          };
          this.dropdownList.push(item);
          if (gym.id === this.user.gymId) {
            this.selectedItems.push(item);
          }
        }

        this.dropdownList = [...this.dropdownList];
      })
    );

    this.buildForm();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  private buildForm = (): void => {
    this.updateUserForm = this.formBuilder.group(
      {
        // TODO: make the validators more relevant:
        firstName: [this.user.firstName, [Validators.required]],
        lastName: [this.user.lastName, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [this.user.password, [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        phone: [this.user.phone, [Validators.required]],
        birthDay: [this.user.birthDay, [Validators.required]],
        address: [this.user.address, [Validators.required]],
        gymId: [this.user.gymId, [Validators.required]],
      },
      { validators: this.checkPasswords }
    );
  };

  onItemSelect(item: any) {
    for (let gym of this.gyms) {
      if (item.item_id === gym.id) {
        this.user.gymId = gym.id;
      }
    }
  }

  onItemDeSelect(item: any) {
    this.user.gymId = null;
  }

  public update = (): Promise<void> => {
    if (!AppUtil.hasValue(this.user)) {
      AppUtil.showWarningMessage(
        `cannot update user because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(this.usersService.update(this.user).subscribe());
  };

  public checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
