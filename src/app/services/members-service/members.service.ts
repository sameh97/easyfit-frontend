import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consts } from '../../common/consts';
import { Observable } from 'rxjs';
import { Member } from 'src/app/model/member';
import { AuthenticationService } from './../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly url = `${Consts.BASE_URL}/api/members`;
  private readonly addUrl = `${Consts.BASE_URL}/api/add-member`;
  private readonly deleteUrl = `${Consts.BASE_URL}/api/member`;
  private readonly updateURL = `${Consts.BASE_URL}/api/update-member`;

  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    //TODO: init gym id somewhere else:
    this.gymId = this.authService.getGymId();
  }

  public create = (member: Member): Observable<any> => {
    member.gymId = this.gymId;

    return this.http.post<Member>(`${this.addUrl}?gymId=${this.gymId}`, member);
  };

  public getAll = (): Observable<Member[]> => {
    return this.http.post<Member[]>(`${this.url}?gymId=${this.gymId}`, {
      observe: 'response',
    });
  };

  public update = (member: Member): Observable<Member> => {
    return this.http.put<Member>(this.updateURL, member);
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.deleteUrl}?id=${id}`);
  };
}
