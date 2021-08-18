import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { Subscription } from 'rxjs';
import { UpdateMemberComponent } from '../update-member/update-member.component';

import {
  MembersTableDataSource,
  MembersTableItem,
} from './members-table-datasource';

@Component({
  selector: 'app-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.css'],
})
export class MembersTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //TODO: check the other inputs sort button issue
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Member>;
  dataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>();

  members: Member[];
  columns: string[] = [
    'FirstName',
    'LastName',
    'phone',
    'birthday',
    'email',
    'address',
    'Status',
    'JoinDate',
    'endOfMembershipDate',
    'Image',
    'update',
    'delete',
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private membersSerive: MembersService,
    private navigationService: NavigationHelperService
  ) {}

  private getAll() {
    this.membersSerive.getAll().subscribe((members) => {
      this.members = members;
      this.dataSource = new MatTableDataSource<Member>(this.members);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  public getActiveDisplayString(member: Member): string {
    if (!member) {
      return '';
    }
    return member.isActive ? 'Active' : 'Not Active';
  }

  public delete = (id: number, member: Member) => {
    const message = `Are you sure you want to delete the member with the following name:
    ${member.firstName} ${member.lastName} ?`;

    this.navigationService
      .openYesNoDialogNoCallback(message, 500)
      .subscribe((res) => {
        if (res) {
          this.membersSerive
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

  public openUpdateMemberDialog(member: Member) {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(UpdateMemberComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService
          .openDialog(UpdateMemberComponent, null, member, null)
          .subscribe()
      );
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
