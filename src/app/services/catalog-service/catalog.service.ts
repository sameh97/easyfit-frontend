import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { AppUtil } from 'src/app/common/app-util';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { Catalog } from 'src/app/model/catalog';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly url = `${AppConsts.BASE_URL}/api/catalog-url`;
  gymId: number;
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.authService.currentUser$
      .pipe(filter((user) => AppUtil.hasValue(user)))
      .subscribe((user) => {
        this.gymId = user.gymId;
      });
  }

  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public create = (catalog: Catalog): Observable<any> => {
    catalog.gymId = this.gymId;

    return this.http.post<Catalog>(this.url, catalog, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public getAllPhones = (): Observable<string[]> => {
    this.initGymID();
    return this.http.get<any[]>(
      `${AppConsts.BASE_URL}/api/members-phones?gymId=${this.gymId}`,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public getAll = (): Observable<Catalog[]> => {
    this.initGymID();
    return this.http.get<Catalog[]>(
      `${AppConsts.BASE_URL}/api/catalog-urls?gymId=${this.gymId}`,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };
  // TODO: make message content class
  public send = (messageContent: any): Observable<any> => {
    return this.http.post(
      `${AppConsts.BASE_URL}/api/send-catalog-whatsapp`,
      messageContent,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public update = (catalog: Catalog): Observable<Catalog> => {
    return this.http.put<Catalog>(`${this.url}`, catalog, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public delete = (uuid: string): Observable<any> => {
    return this.http.delete(`${this.url}?uuid=${uuid}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };
}
