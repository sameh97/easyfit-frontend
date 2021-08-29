import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { Trainer } from 'src/app/model/trainer';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class TrainersService {
  private readonly url = `${AppConsts.BASE_URL}/api/trainers`;
  private readonly addUrl = `${AppConsts.BASE_URL}/api/add-trainer`;
  private readonly deleteUrl = `${AppConsts.BASE_URL}/api/trainer`;
  private readonly updateUrl = `${AppConsts.BASE_URL}/api/update-trainer`;
  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.gymId = this.authService.getGymId();
  }

  public create = (trainer: Trainer): Observable<any> => {
    trainer.gymId = this.gymId;

    return this.http.post<Trainer>(
      `${this.addUrl}?gymId=${this.gymId}`,
      trainer,
      { headers: CoreUtil.createAuthorizationHeader() }
    );
  };

  public getAll = (): Observable<Trainer[]> => {
    return this.http.post<Trainer[]>(`${this.url}?gymId=${this.gymId}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public update = (trainer: Trainer): Observable<Trainer> => {
    return this.http.put<Trainer>(this.updateUrl, trainer, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.deleteUrl}?id=${id}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };
}
