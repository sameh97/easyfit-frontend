import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { Trainer } from 'src/app/model/trainer';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TrainersService {
  private readonly url = `${AppConsts.BASE_URL}/api/trainers`;
  private readonly addUrl = `${AppConsts.BASE_URL}/api/add-trainer`;
  private readonly deleteUrl = `${AppConsts.BASE_URL}/api/trainer`;
  private readonly updateUrl = `${AppConsts.BASE_URL}/api/update-trainer`;
  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService : AuthenticationService
  ) { 
    this.initGymID();
  }
  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public create = (trainer: Trainer): Observable<any> => {
    this.initGymID();
    trainer.gymId = this.gymId;
    return this.http.post<Trainer>(`${this.addUrl}?gymId=${this.gymId}`,trainer);
  }

  public getAll = ():Observable<Trainer[]> => {
    this.initGymID();
    return this.http.get<Trainer[]>(`${this.url}?gymId=${this.gymId}`);
  }
  public update = (trainer :Trainer) : Observable<Trainer> => {
    return this.http.put<Trainer>(this.updateUrl,trainer);
  }

  public delete = (id:number) : Observable<any> => {
    return this.http.delete(`${this.deleteUrl}?id=${id}`);
  }
}
