import { AppNotificationMessage } from '../model/app-notification-message';
import { AppUtil } from '../common/app-util';
import { CoreUtil } from '../common/core-util';
import { ClientDataService } from '../services/client-data.service';
import { User } from '../model/user';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../common/consts';

@Injectable({
  providedIn: 'root',
})
export class UserNotificationsService extends ClientDataService {
  private currentUser: User;
  private gymId: number;
  private myNotificationsListSubject = new BehaviorSubject<
    AppNotificationMessage[]
  >([]);
  private readonly URL_KEY_TARGET_USER = 'targetUserId';
  private readonly URL_KEY_SEEN = 'seen';

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient
  ) {
    super(`${AppConsts.BASE_URL}/api`, http);
    this.gymId = this.authService.getGymId();
    // this.initNotificationsForCurrentUser();
  }

  public getAll = (): Observable<AppNotificationMessage[]> => {
    this.gymId = this.authService.getGymId();
    // return super.getAll(this.gymId);

    return this.http
      .get<AppNotificationMessage[]>(
        `${AppConsts.BASE_URL}/api/notifications?gymId=${this.gymId}`,
        {
          headers: CoreUtil.createAuthorizationHeader(),
        }
      )
      .pipe(catchError(AppUtil.handleError));
  };

  public getByMachineSerialNumber = (
    machineSerialNumber: string
  ): Observable<AppNotificationMessage[]> => {
    this.gymId = this.authService.getGymId();
    return this.http.get<AppNotificationMessage[]>(
      `${AppConsts.BASE_URL}/api/machine/notifications?gymId=${this.gymId}&machineSerialNumber=${machineSerialNumber}`
    );
  };

  public update = (
    appNotificationMessage: AppNotificationMessage
  ): Observable<AppNotificationMessage> => {
    return this.http.put<AppNotificationMessage>(
      `${AppConsts.BASE_URL}/api/notification`,
      appNotificationMessage
    );
  };

  public initNotificationsForUser(userId: string): void {
    this.resetMyNotifications();
    if (!AppUtil.hasValue(userId)) {
      return;
    }
    this.getNotificaitonsListForUser(userId)
      .pipe(take(1))
      .subscribe(
        (notificationsList: AppNotificationMessage[]) => {
          this.addToMyNotifications(notificationsList);
        },
        (err: Error) => {
          AppUtil.showErrorMessage(`Cannot load notifications list`);
          this.authService.logout();
        }
      );
  }

  public getNotificaitonsListForUser(
    userId: string
  ): Observable<AppNotificationMessage[]> {
    const filterParamMap: Map<string, string> = new Map<string, string>([
      [this.URL_KEY_TARGET_USER, userId],
      [this.URL_KEY_SEEN, 'false'],
    ]);

    return super.getAllByParameter(filterParamMap, null, null).pipe(
      map((notifications: any) => {
        return notifications as AppNotificationMessage[];
      })
    );
  }

  public addToMyNotifications(
    notificaitonsToAdd: AppNotificationMessage[]
  ): void {
    const currNotificationData: AppNotificationMessage[] =
      this.myNotificationsListSubject.value;

    for (const notificaiton of notificaitonsToAdd) {
      const notificationFromMyList = currNotificationData.find(
        (notification) => notification.id === notificaiton.id
      );
      if (!notificationFromMyList) {
        currNotificationData.unshift(notificaiton);
      }
    }

    this.myNotificationsListSubject.next(currNotificationData);
  }

  public removeFromMyNotifications(
    notificaitonToRemove: AppNotificationMessage
  ): void {
    const currNotificationData: AppNotificationMessage[] =
      this.myNotificationsListSubject.value;

    const indexOfNotification: number = currNotificationData.findIndex(
      (notification) => notification.id === notificaitonToRemove.id
    );
    if (indexOfNotification !== -1) {
      currNotificationData.splice(indexOfNotification, 1);
      this.myNotificationsListSubject.next(currNotificationData);
    }
  }

  get myNotificationsList$(): Observable<AppNotificationMessage[]> {
    return this.myNotificationsListSubject.asObservable();
  }

  get myNotificationsCount$(): Observable<number> {
    return this.myNotificationsListSubject.asObservable().pipe(
      map((notificationData: AppNotificationMessage[]) => {
        if (!notificationData) {
          return 0;
        }
        return notificationData.length;
      })
    );
  }

  public resetMyNotifications(): void {
    this.myNotificationsListSubject.next([]);
  }

  // public updateAllMyNotifications(
  //   patchRequestObj: Partial<AppNotificationMessage>
  // ): Observable<any> {
  //   if (!this.currentUser) {
  //     throwError('Cannot update all notifications, please try again later');
  //   }
  //   patchRequestObj.targetUserIds = [this.currentUser.id];
  //   const url = `${this.url}targetUser/${this.currentUser.id}`;
  //   return this.http
  //     .patch(url, patchRequestObj, {
  //       headers: CoreUtil.createAuthorizationHeader(),
  //       observe: 'response',
  //     })
  //     .pipe(catchError(AppUtil.handleError));
  // }

  private initNotificationsForCurrentUser(): void {
    this.authService.currentUser$.subscribe(
      (user: User) => {
        this.currentUser = user;
        this.initNotificationsForUser(
          this.currentUser ? this.currentUser.id : null
        );
      },
      (err: User) => {
        AppUtil.showErrorMessage(AppConsts.SESSION_EXPIRED_ERROR);
        this.authService.logout();
      }
    );
  }
}
