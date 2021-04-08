import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/model/member';
import { MembersService } from 'src/app/services/members-service/members.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})


export class MembersComponent implements OnInit {
  public members$: Observable<Member[]>;
  closeResult = '';
  searchValue: string;

  constructor(private membersSerive: MembersService) {}

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
}
