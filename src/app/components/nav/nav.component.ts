import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { AppUtil } from 'src/app/common/app-util';
import { NotificationsDropdownComponent } from '../notifications/notifications-dropdown.component';
import { AppNotificationMessage } from 'src/app/model/app-notification-message';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnDestroy, AfterViewInit {
  @ViewChild(NotificationsDropdownComponent)
  notificationsDropdownComponent: NotificationsDropdownComponent;

  notifications: AppNotificationMessage[] = [];

  private subscriptions: Subscription[] = [];
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  getNotificationsLength() {
    if (!this.notifications) {
      return 0;
    }

    return this.notifications.length;
  }

  logout() {
    this.authService.logout();
  }

  constructor(
    private authService: AuthenticationService,
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationHelperService
  ) {}
  ngAfterViewInit(): void {
    this.notifications = this.notificationsDropdownComponent.notifications;
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
