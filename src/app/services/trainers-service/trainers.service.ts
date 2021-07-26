import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consts } from 'src/app/common/consts';
import { Trainer } from 'src/app/model/trainer';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TrainersService {
  private readonly url = `${Consts.BASE_URL}/api/trainers`;
  private readonly addUrl = `${Consts.BASE_URL}/api/add-trainer`;
  private readonly deleteUrl = `${Consts.BASE_URL}/api/trainer`;
  private readonly updateUrl = `${Consts.BASE_URL}/api/update-trainer`;
  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService : AuthenticationService
  ) { 
    this.gymId = this.authService.getGymId();
  }

  public create = (trainer: Trainer): Observable<any> => {
    trainer.gymId = this.gymId;

    return this.http.post<Trainer>(`${this.addUrl}?gymId=${this.gymId}`,trainer);
  }

  public getAll = ():Observable<Trainer[]> => {
    return this.http.post<Trainer[]>(`${this.url}?gymId=${this.gymId}`, {
      observe : 'response',
    });
  }

  public update = (trainer :Trainer) : Observable<Trainer> => {
    return this.http.put<Trainer>(this.updateUrl,trainer);
  }

  public delete = (id:number) : Observable<any> => {
    return this.http.delete(`${this.deleteUrl}?id=${id}`);
  }
}
