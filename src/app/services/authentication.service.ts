import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Consts } from '../common/consts';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AppUtil } from '../common/app-util';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private url = `${Consts.BASE_URL}/api/login`;
  private readonly jwtHelper = new JwtHelperService();
  //TODO: check gym id type:
  //private gymId: number;

  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(
    null
  );

  constructor(private http: HttpClient, private router: Router) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(Consts.KEY_USER_TOKEN);
    if (!token) {
      return false;
    }
    const tokenExpired = this.jwtHelper.isTokenExpired(token);
    return !tokenExpired;
  }

  public login(user: User): Observable<any> {
    return this.http
      .post<string>(this.url, user, { observe: 'response' })
      .pipe(catchError(AppUtil.handleError));
  }

  public persistTokenFromResponse(response: any): void {
    if (!response[`status`] || response[`status`] !== 200) {
      throw new Error('Response status should be 200');
    }

    if (!response[`headers`]) {
      throw new Error('No headers found in response');
    }

    const headers = response[`headers`];

    const authorizationValue: string = headers.get(`Authorization`);

    if (!authorizationValue) {
      throw new Error('Cannot find token inside headers');
    }

    window.localStorage.setItem(Consts.KEY_USER_TOKEN, authorizationValue);
    const user = this.extractUserFromToken(authorizationValue);
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem(Consts.KEY_USER_TOKEN);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private extractUserFromToken(token: string): User {
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);

      const user: User = { ...decodedToken.sub };

      AppUtil.removePassword(user);

      return user;
    } catch (ex) {
      console.error('Saved user token is currupted');
      this.logout();
      return null;
    }
  }

  public getGymId(): number {
    const token = localStorage.getItem(Consts.KEY_USER_TOKEN);

    const decodedToken = this.jwtHelper.decodeToken(token);

    const user: User = { ...decodedToken.sub };

    const gymId = user.gymId;
    return gymId;
  }
}
