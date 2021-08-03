import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { SchedulerService } from 'src/app/services/scheduler-service/scheduler.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-update-scheduled-job',
  templateUrl: './update-scheduled-job.component.html',
  styleUrls: ['./update-scheduled-job.component.css'],
})
export class UpdateScheduledJobComponent implements OnInit, OnDestroy {
  updateJobForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private scheduledJob: ScheduledJob,
    private schedulerService: SchedulerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm = (): void => {
    this.updateJobForm = this.formBuilder.group({
      // TODO: make the validators more relevant:
      id: [this.scheduledJob.id, [Validators.required]],
      jobID: [this.scheduledJob.jobID, [Validators.required]],
      machineSerialNumber: [
        this.scheduledJob.machineSerialNumber,
        [Validators.required],
      ],
      startTime: [this.scheduledJob.startTime, [Validators.required]],
      endTime: [this.scheduledJob.endTime, [Validators.required]],
      daysFrequency: [this.scheduledJob.daysFrequency, [Validators.required]],
      isActive: [this.scheduledJob.isActive, [Validators.required]],
      gymId: [this.scheduledJob.gymId, [Validators.required]],
    });
  };

  // public onFrequencySelected(selectedHours: any) {
  //   let selectedHoursDays = selectedHours * 24;
  //   return selectedHoursDays;
  // }

  public update = (scheduledJob: ScheduledJob): Promise<void> => {
    if (!AppUtil.hasValue(scheduledJob)) {
      AppUtil.showWarningMessage(
        `cannot update scheduled Job because there is a missing fields`
      );
      return;
    }

    this.subscriptions.push(
      this.schedulerService.update(scheduledJob).subscribe()
    );
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
