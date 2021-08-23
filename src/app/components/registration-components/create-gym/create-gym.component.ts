import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Gym } from 'src/app/model/gym';
import { GymsService } from 'src/app/services/gyms-service/gyms.service';

@Component({
  selector: 'app-create-gym',
  templateUrl: './create-gym.component.html',
  styleUrls: ['./create-gym.component.css'],
})
export class CreateGymComponent implements OnInit, OnDestroy {
  addGymForm: FormGroup;
  gym: Gym;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private gymsService: GymsService
  ) {}

  ngOnInit(): void {
    this.gym = new Gym();
    this.addGymForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.gym)) {
      AppUtil.showWarningMessage(
        `cannot create gym because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.gymsService.create(this.gym).subscribe(
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
