import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { Gym } from 'src/app/model/gym';

@Injectable({
  providedIn: 'root',
})
export class GymsService {
  private readonly url = `${AppConsts.BASE_URL}/api`;

  constructor(private http: HttpClient) {}

  public getAll = (): Observable<Gym[]> => {
    return this.http
      .get<Gym[]>(`${this.url}/gym`, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public create = (gym: Gym): Observable<any> => {
    return this.http
      .post<Gym>(`${this.url}/add-gym`, gym, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public update = (gym: Gym): Observable<Gym> => {
    return this.http
      .put<Gym>(`${this.url}/gym`, gym, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };

  public delete = (id: number): Observable<any> => {
    return this.http
      .delete(`${this.url}/gym?id=${id}`, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(catchError(AppUtil.handleError));
  };
}
