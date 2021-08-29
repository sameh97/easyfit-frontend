import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { Machine } from 'src/app/model/machine';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private readonly url = `${AppConsts.BASE_URL}/api/machines`;
  private gymId: number;
  private addedMachineSubject: BehaviorSubject<Machine> =
    new BehaviorSubject<Machine>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public addedMachineObs = (): Observable<Machine> => {
    return this.addedMachineSubject.asObservable();
  };

  public getBySerialNumber = (
    machineSerialNumber: number
  ): Observable<Machine> => {
    return this.http.get<Machine>(
      `${AppConsts.BASE_URL}/api/machine?serialNumber=${machineSerialNumber}`,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public create = (machine: Machine): Observable<any> => {
    this.initGymID();
    machine.gymId = this.gymId;

    //TODO: check if query is needed:
    return this.http
      .post<Machine>(
        `${AppConsts.BASE_URL}/api/machine?gymId=${this.gymId}`,
        machine,
        {
          headers: CoreUtil.createAuthorizationHeader(),
        }
      )
      .pipe(
        tap((machine: Machine) => {
          this.addedMachineSubject.next(machine);
        })
      );
  };

  public getAll = (): Observable<Machine[]> => {
    this.initGymID();
    return this.http.get<Machine[]>(`${this.url}?gymId=${this.gymId}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public update = (machine: Machine): Observable<Machine> => {
    return this.http
      .put<Machine>(`${AppConsts.BASE_URL}/api/machine`, machine, {
        headers: CoreUtil.createAuthorizationHeader(),
      })
      .pipe(
        tap((machine: Machine) => {
          this.addedMachineSubject.next(machine);
        })
      );
  };

  public delete = (serialNumber: string, gymId: number): Observable<any> => {
    return this.http.delete(
      `${AppConsts.BASE_URL}/api/machine?serialNumber=${serialNumber}&gymId=${gymId}`,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };
}
