import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { ScheduledJob } from 'src/app/model/scheduled-job';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  private readonly url = `${AppConsts.BASE_URL}/api/schedules`;

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
      `${this.url}/api/add-schedule?gymId=${this.gymId}`,
      scheduleJob
    );
  };

  public getAll = (): Observable<ScheduledJob[]> => {
    this.initGymID();
    return this.http.get<ScheduledJob[]>(`${this.url}?gymId=${this.gymId}`);
  };

  public update = (scheduledJob: ScheduledJob): Observable<ScheduledJob> => {
    return this.http.put<ScheduledJob>(
      `${this.url}/api/update-schedule`,
      scheduledJob
    );
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(
      `${AppConsts.BASE_URL}/api/delete-schedule?id=${id}`
    );
  };
}
