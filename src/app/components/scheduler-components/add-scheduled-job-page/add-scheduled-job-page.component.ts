import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppUtil } from 'src/app/common/app-util';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { SchedulerService } from 'src/app/services/scheduler-service/scheduler.service';
import { Subscription } from 'rxjs';
import { MachinesService } from './../../../services/machines-service/machines.service';
import { Machine } from 'src/app/model/machine';
import { filter, switchMap } from 'rxjs/operators';
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
    private schedulerService: SchedulerService,
    private machinesService: MachinesService
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
          this.machineExistValidator,
        ],
      ],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      daysFrequency: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
    });
  }

  private machineExistValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    let machineToCheck: Machine = null;

    this.subscriptions.push(
      this.machinesService
        .getBySerialNumber(control.value)
        .pipe(filter((machine) => AppUtil.hasValue(machine)))
        .subscribe((machine) => {
          machineToCheck = machine;
        })
    );

    // return AppUtil.hasValue(machineToCheck)
    //    null
    //   : { machineNotExist: { value: control.value } };

    return null;
  };

  // if (!AppUtil.hasValue(machineToCheck)) {
  //   return { machineNotExist: { value: control.value } };
  // }

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

    this.scheduledJob.jobID = Number(this.scheduledJob.jobID)

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
