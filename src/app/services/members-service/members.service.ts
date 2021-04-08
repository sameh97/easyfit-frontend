import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consts } from '../../common/consts';
import { Observable } from 'rxjs';
import { Member } from 'src/app/model/member';
import { AuthenticationService } from './../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly url = `${Consts.BASE_URL}/api/members`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public getAll(): Observable<Member[]> {
    const gymId = this.authService.getGymId();

    return this.http.post<Member[]>(`${this.url}?gymId=${gymId}`, {
      observe: 'response',
    });
  }
}
