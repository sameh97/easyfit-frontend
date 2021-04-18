import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consts } from 'src/app/common/consts';
import { Product } from 'src/app/model/product';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly url = `${Consts.BASE_URL}/api/products`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public getAll(): Observable<Product[]> {
    const gymId = this.authService.getGymId();

    return this.http.post<Product[]>(`${this.url}?gymId=${gymId}`, {
      observe: 'response',
    });
  }
}
