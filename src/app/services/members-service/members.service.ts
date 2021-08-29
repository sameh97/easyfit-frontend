import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../../common/consts';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from 'src/app/model/member';
import { AuthenticationService } from './../authentication.service';
import { CoreUtil } from 'src/app/common/core-util';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly url = `${AppConsts.BASE_URL}/api/members`;
  private readonly addUrl = `${AppConsts.BASE_URL}/api/add-member`;
  private readonly deleteUrl = `${AppConsts.BASE_URL}/api/member`;
  private readonly updateURL = `${AppConsts.BASE_URL}/api/update-member`;
  private addedMemberSubject: BehaviorSubject<Member> =
    new BehaviorSubject<Member>(null);

  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.initGymID();
  }

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public addedMemberObs = (): Observable<Member> => {
    return this.addedMemberSubject.asObservable();
  };

  public create = (member: Member): Observable<any> => {
    this.initGymID();
    member.gymId = this.gymId;

    return this.http
      .post<Member>(`${this.addUrl}?gymId=${this.gymId}`, member, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(
        tap((member: Member) => {
          this.addedMemberSubject.next(member);
        })
      );
  };

  public getAll = (): Observable<Member[]> => {
    this.initGymID();
    return this.http.get<Member[]>(`${this.url}?gymId=${this.gymId}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public update = (member: Member): Observable<Member> => {
    return this.http
      .put<Member>(this.updateURL, member, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(
        tap((member: Member) => {
          this.addedMemberSubject.next(member);
        })
      );
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.deleteUrl}?id=${id}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };
}
