import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Gym } from 'src/app/model/gym';
import { User } from 'src/app/model/user';
import { GymsService } from 'src/app/services/gyms-service/gyms.service';
import { UsersService } from 'src/app/services/users-service/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  addUserForm: FormGroup;
  user: User;
  gyms: Gym[];
  private subscriptions: Subscription[] = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private gymsService: GymsService
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
        }

        this.dropdownList = [...this.dropdownList];
      })
    );

    this.user = new User();
    this.addUserForm = this.formBuilder.group(
      {
        // TODO: make the validators more relevant:
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        birthDay: ['', [Validators.required]],
        address: ['', [Validators.required]],
        gymId: ['', [Validators.required]],
      },
      { validators: this.checkPasswords }
    );

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

  // public id: string;
  // public firstName: string;
  // public lastName: string;
  // public email: string;
  // public password: string;
  // public roleId: number;
  // public phone: string;
  // public birthDay: Date;
  // public address: string;
  // public gymId: number;

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

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.user)) {
      AppUtil.showWarningMessage(
        `cannot create user because there is a missing fields`
      );
      return;
    }

    this.user.roleId = 1;

    this.subscriptions.push(
      this.usersService.create(this.user).subscribe(
        () => {},
        (err: Error) => {
          //TODO:  display an appropriate message in the UI
          AppUtil.showError(err);
        }
      )
    );
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
