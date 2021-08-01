import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Machine } from 'src/app/model/machine';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { MachinesService } from 'src/app/services/machines-service/machines.service';
import { SchedulerService } from 'src/app/services/scheduler-service/scheduler.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { MachineDetailsComponent } from '../machine-details/machine-details.component';

@Component({
  selector: 'app-scheduler-page',
  templateUrl: './scheduler-page.component.html',
  styleUrls: ['./scheduler-page.component.css'],
})
export class SchedulerPageComponent implements OnInit, OnDestroy {
  scheduledJobs: ScheduledJob[];
  private subscriptions: Subscription[] = [];

  constructor(
    private schedulerService: SchedulerService,
    private machineService: MachinesService,
    private navigationService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  private getAll = (): void => {
    this.schedulerService.getAll().subscribe((scheduledJobs) => {
      this.scheduledJobs = scheduledJobs;
    });
  };

  public getJob = (jobID: number): string => {
    if (jobID === 1) {
      return 'clean';
    } else if (jobID === 2) {
      return 'Machine Service';
    } else {
      return 'Not defined';
    }
  };

  public getJobStatus = (isActive: boolean): string => {
    if (isActive) {
      return 'Scheduled';
    } else {
      return 'Not Scheduled';
    }
  };

  public getMachineById = (machineID: number): Observable<Machine> => {
    // let machineToRetreve: Machine;

    // this.machineService.getById(machineID).subscribe((machine) => {
    //   machineToRetreve = machine;
    // });

    return this.machineService.getById(machineID);
  };

  public async openMachineDetailsDialog(machineId: number) {
    const machine$: Observable<Machine> = await this.machineService.getById(
      machineId
    );

    let machine: Machine;

    machine$.subscribe((machineFromDb) => {
      machine = machineFromDb;
    });

    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(MachineDetailsComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService
          .openDialog(MachineDetailsComponent, null, machine, null)
          .subscribe()
      );
    }
  }

  public splitTime(numberOfHours) {
    var Days = Math.floor(numberOfHours / 24);
    var Remainder = numberOfHours % 24;
    var Hours = Math.floor(Remainder);
    var Minutes = Math.floor(60 * (Remainder - Hours));
    return { Days: Days, Hours: Hours, Minutes: Minutes };
  }

  public timeResult = (numberOfHours) => {
    const res = this.splitTime(numberOfHours);
    return res;
  };

  public delete = (scheduledJob: ScheduledJob) => {
    //TODO: make the message show the machine's details:
    const message = `Are you sure you want to delete the Scheduled job for the following machine:
    ${scheduledJob.machineID}?`;

    this.navigationService
      .openYesNoDialogNoCallback(message, 500)
      .subscribe((res) => {
        if (res) {
          this.schedulerService
            .delete(scheduledJob.id)
            .pipe(
              tap((res) => {
                this.getAll();
              })
            )
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                AppUtil.showError(err);
              }
            );
        }
      });
  };
}
