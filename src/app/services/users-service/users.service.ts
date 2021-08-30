import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly url = `${AppConsts.BASE_URL}/api`;

  constructor(private http: HttpClient) {}

  public getAll = (): Observable<User[]> => {
    return this.http
      .get<User[]>(`${this.url}/users`, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public create = (user: User): Observable<any> => {
    return this.http
      .post<User>(`${this.url}/register`, user, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public update = (user: User): Observable<User> => {
    return this.http
      .put<User>(`${this.url}/user`, user, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public delete = (id: number): Observable<any> => {
    return this.http
      .delete(`${this.url}/user?id=${id}`, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };
}
