import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  public members$: Observable<Member[]>;
  closeResult = '';
  searchValue: string;

  constructor(
    private membersSerive: MembersService,
    private navigationService: NavigationHelperService
  ) {}

  ngOnInit(): void {
    this.getAll();
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
}
