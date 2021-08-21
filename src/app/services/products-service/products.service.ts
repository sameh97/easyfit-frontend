import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
import { CoreUtil } from 'src/app/common/core-util';
import { Bill } from 'src/app/model/bill';
import { Product } from 'src/app/model/product';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly url = `${AppConsts.BASE_URL}/api`;
  private gymId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.initGymID();
  }

  public getAll(): Observable<Product[]> {
    const gymId = this.authService.getGymId();

    return this.http.get<Product[]>(`${this.url}/products?gymId=${gymId}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  }

  public getAllBills(): Observable<Bill[]> {
    const gymId = this.authService.getGymId();

    return this.http.get<Bill[]>(`${this.url}/bills?gymId=${gymId}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  }

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public sell = (bill: Bill): Observable<Bill> => {
    return this.http.post<Bill>(`${this.url}/add-bill`, bill, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public create = (product: Product): Observable<any> => {
    this.initGymID();
    product.gymId = this.gymId;

    return this.http.post<Product>(
      `${this.url}/add-product?gymId=${this.gymId}`,
      product,
      {
        headers: CoreUtil.createAuthorizationHeader(),
      }
    );
  };

  public update = (product: Product): Observable<Product> => {
    return this.http.put<Product>(`${this.url}/update-product`, product, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/delete-product?id=${id}`, {
      headers: CoreUtil.createAuthorizationHeader(),
    });
  };
}
