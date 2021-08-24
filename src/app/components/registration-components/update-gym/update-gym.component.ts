import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Gym } from 'src/app/model/gym';
import { GymsService } from 'src/app/services/gyms-service/gyms.service';

@Component({
  selector: 'app-update-gym',
  templateUrl: './update-gym.component.html',
  styleUrls: ['./update-gym.component.css'],
})
export class UpdateGymComponent implements OnInit, OnDestroy {
  updateGymForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private gym: Gym,
    private gymsService: GymsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateGymForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      name: [this.gym.name, [Validators.required]],
      phone: [this.gym.phone, [Validators.required]],
      address: [this.gym.address, [Validators.required]],
    });
  };

  public update = (): Promise<void> => {
    if (!AppUtil.hasValue(this.gym)) {
      AppUtil.showWarningMessage(
        `cannot update gym because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(this.gymsService.update(this.gym).subscribe());
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
