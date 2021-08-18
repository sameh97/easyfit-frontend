import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  private readonly url = `${AppConsts.BASE_URL}/api`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.initGymID();
  }

  private gymId: number;

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public create = (scheduleJob: ScheduledJob): Observable<any> => {
    this.initGymID();
    scheduleJob.gymId = this.gymId;

    return this.http.post<ScheduledJob>(
      `${this.url}/add-schedule?gymId=${this.gymId}`,
      scheduleJob,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public getAll = (): Observable<ScheduledJob[]> => {
    this.initGymID();
    return this.http.get<ScheduledJob[]>(
      `${this.url}/schedules?gymId=${this.gymId}`,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public update = (scheduledJob: ScheduledJob): Observable<ScheduledJob> => {
    return this.http.put<ScheduledJob>(
      `${this.url}/update-schedule`,
      scheduledJob,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/delete-schedule?id=${id}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };
}
