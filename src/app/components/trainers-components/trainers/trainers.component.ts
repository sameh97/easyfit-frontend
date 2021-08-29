import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Trainer } from 'src/app/model/trainer';
import { TrainersService } from 'src/app/services/trainers-service/trainers.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AddTrainerComponent } from '../add-trainer/add-trainer.component';
import { UpdateTrainerComponent } from '../update-trainer/update-trainer.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css'],
})
export class TrainersComponent implements OnInit, OnDestroy {
  public trainers$: Observable<Trainer[]>;
  closeResult = '';
  searchValue: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private trainersService: TrainersService,
    private navigationService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  private getAll() {
    this.trainers$ = this.trainersService.getAll();
  }

  public getActiveDisplayString(trainer: Trainer): string {
    if (!trainer) {
      return '';
    }
    return trainer.isActive ? 'Active' : 'Not Active';
  }

  public delete = (id: number, trainer: Trainer) => {
    const message = `Are you sure you want to delete thetrainer with the following name:
    ${trainer.firstName} ${trainer.lastName} ?`;

    this.navigationService
      .openYesNoDialogNoCallback(message, 500)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.trainersService
            .delete(id)
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

  public openCreateTrainerDialog() {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(AddTrainerComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService.openDialog(AddTrainerComponent).subscribe()
      );
    }
  }

  public openUpdateTrainerDialog(trainer: Trainer) {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(UpdateTrainerComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService
          .openDialog(UpdateTrainerComponent, null, trainer, null)
          .subscribe()
      );
    }
  }
}
