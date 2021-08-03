import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUtil } from 'src/app/common/app-util';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { SchedulerService } from 'src/app/services/scheduler-service/scheduler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-scheduled-job-page',
  templateUrl: './add-scheduled-job-page.component.html',
  styleUrls: ['./add-scheduled-job-page.component.css'],
})
export class AddScheduledJobPageComponent implements OnInit, OnDestroy {
  addScheduledJobForm: FormGroup;
  scheduledJob: ScheduledJob;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService
  ) {}

  ngOnInit(): void {
    this.scheduledJob = new ScheduledJob();
    this.addScheduledJobForm = this.formBuilder.group({
      // TODO: make the validators more relevant:

      jobID: ['', [Validators.required]],
      machineSerialNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      daysFrequency: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  public create = (): Promise<void> => {
    if (!AppUtil.hasValue(this.scheduledJob)) {
      AppUtil.showWarningMessage(
        `cannot create scheduled Job because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.schedulerService.create(this.scheduledJob).subscribe(
        () => {},
        (err: Error) => {
          //TODO:  display an appropriate message in the UI
          AppUtil.showError(err);
        }
      )
    );
  };
}
