import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AppUtil } from 'src/app/common/app-util';
import { NotificationsDropdownComponent } from '../notifications/notifications-dropdown.component';
import { AppNotificationMessage } from 'src/app/model/app-notification-message';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SocketTopics } from 'src/app/shared/util/socket-util';
import { UserNotificationsService } from 'src/app/services/user-notifications.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  notifications: AppNotificationMessage[] = [];
  notificationNumber: number = 0;
  private subscriptions: Subscription[] = [];
  currentUser: User = null;

  constructor(
    private authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationHelperService,
    private webSocketService: WebSocketService,
    private userNotificationsService: UserNotificationsService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
    });

    this.subscriptions.push(
      this.userNotificationsService.getAll().subscribe(
        (notifications) => {
          let sum = 0;
          for (let i = 0; i < notifications.length; i++) {
            if (!notifications[i].seen) {
              sum++;
            }
          }
          this.notificationNumber = sum;
          // TODO: make a function that retreves only the count of the notifications
        },
        (error: Error) => {
          AppUtil.showError(error);
        }
      )
    );

    this.subscriptions.push(
      this.webSocketService
        .onMessage(SocketTopics.TOPIC_GROUPED_NOTIFICATION)
        .subscribe((notificationFromServer: AppNotificationMessage) => {
          let sum = 0;
          for (let notification of notificationFromServer.content) {
            sum += notification.notificationsCount;
          }
          this.notificationNumber = sum;
        })
    );
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  getNotificationsLength() {
    return this.notificationNumber;
  }

  logout() {
    const message: string = `Are you sure you want to log out?`;
    this.navigationService
      .openYesNoDialogNoCallback(message, 500)
      .subscribe((res) => {
        if (res) {
          this.authService.logout();
        }
      });
  }

  public openNotificationsDialog() {
    this.subscriptions.push(
      this.navigationService
        .openDialog(NotificationsDropdownComponent)
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
