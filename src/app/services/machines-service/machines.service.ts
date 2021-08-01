import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { Machine } from 'src/app/model/machine';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private readonly url = `${AppConsts.BASE_URL}/api/machines`;
  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public getById = (machineId: number): Observable<Machine> => {
    return this.http.get<Machine>(
      `${AppConsts.BASE_URL}/api/machine?machineId=${machineId}`
    );
  };

  public getAll = (): Observable<Machine[]> => {
    this.initGymID();
    return this.http.get<Machine[]>(`${this.url}?gymId=${this.gymId}`);
  };

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };
}
