import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AddMemberComponent } from '../add-member/add-member.component';

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

  public delete = (id: number, name: string) => {
    this.navigationService
      .openYesNoDialogNoCallback(`Are you sure you want to delete ${name}?`)
      .subscribe((res) => {
        if (res) {
          this.membersSerive.delete(id).subscribe(
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
}
