import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AddMemberComponent } from '../add-member/add-member.component';
import { UpdateMemberComponent } from '../update-member/update-member.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit, OnDestroy {
  public members$: Observable<Member[]>;
  closeResult = '';
  searchValue: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private membersSerive: MembersService,
    private navigationService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  private getAll() {
    this.members$ = this.membersSerive.getAll();
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

  public openCreateMemberDialog() {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(AddMemberComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService.openDialog(AddMemberComponent).subscribe()
      );
    }
  }

  public openUpdateMemberDialog(member: Member) {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService
          .openDialog(UpdateMemberComponent, '100vw', null, true)
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService.openDialog(UpdateMemberComponent, null, member, null).subscribe()
      );
    }
  }
}