import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { GroupTraining } from 'src/app/model/group-training';
import { GroupTrainingService } from 'src/app/services/group-training-service/group-training.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AddGroupTrainingComponent } from '../add-group-training/add-group-training.component';
import { ShowSingleTrainingComponent } from '../show-single-training/show-single-training.component';

@Component({
  selector: 'app-display-trainings',
  templateUrl: './display-trainings.component.html',
  styleUrls: ['./display-trainings.component.css'],
})
export class DisplayTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<GroupTraining>;

  dataSource: MatTableDataSource<GroupTraining> =
    new MatTableDataSource<GroupTraining>();
  private subscriptions: Subscription[] = [];

  trainings: GroupTraining[];
  columns: string[] = [
    'Training',
    'startTime',
    'description',
    'update',
    'delete',
  ];

  constructor(
    private navigationService: NavigationHelperService,
    private groupTrainingService: GroupTrainingService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  private getAll() {
    this.subscriptions.push(
      this.groupTrainingService.getAll().subscribe((trainings) => {
        this.trainings = trainings;
        this.dataSource = new MatTableDataSource<GroupTraining>(this.trainings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    );
  }

  public openCreateTrainingDialog() {
    this.subscriptions.push(
      this.navigationService
        .openDialog(AddGroupTrainingComponent, null, null, true)
        .subscribe()
    );
  }

  public openViewTrainingDialog(training: GroupTraining) {
    this.subscriptions.push(
      this.navigationService
        .openDialog(ShowSingleTrainingComponent, '1200px', training, true)
        .subscribe()
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
