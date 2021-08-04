import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConsts } from 'src/app/common/consts';
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

    return this.http.get<Product[]>(`${this.url}/products?gymId=${gymId}`);
  }

  // TODO: make it observable:
  private initGymID = (): void => {
    this.gymId = this.authService.getGymId();
  };

  public create = (product: Product): Observable<any> => {
    this.initGymID();
    product.gymId = this.gymId;

    return this.http.post<Product>(
      `${this.url}/add-product?gymId=${this.gymId}`,
      product
    );
  };

  public update = (product: Product): Observable<Product> => {
    return this.http.put<Product>(`${this.url}/update-product`, product);
  };

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/delete-product?id=${id}`);
  };
}
