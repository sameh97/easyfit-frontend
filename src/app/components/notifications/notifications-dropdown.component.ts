import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { AppNotificationMessage } from 'src/app/model/app-notification-message';
import { UserNotificationsService } from 'src/app/services/user-notifications.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SocketTopics } from 'src/app/shared/util/socket-util';

@Component({
  selector: 'app-notifications-dropdown',
  templateUrl: './notifications-dropdown.component.html',
  styleUrls: ['./notifications-dropdown.component.css'],
})
export class NotificationsDropdownComponent implements OnInit, OnDestroy {
  showNotification: boolean;
  notifications: AppNotificationMessage[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private userNotificationsService: UserNotificationsService,
    private webSocketService: WebSocketService
  ) {}

  openNotification(state: boolean) {
    this.showNotification = state;
  }
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.userNotificationsService.getAll().subscribe((notifications) => {
        this.notifications = notifications;
      })
    );

    this.subscriptions.push(
      this.webSocketService
        .onMessage(SocketTopics.TOPIC_CLEAN_MACHINE)
        .subscribe((job: AppNotificationMessage) => {
          this.notifications.unshift(job);
          this.notifications = [...this.notifications];
        })
    );

    this.subscriptions.push(
      this.webSocketService
        .onMessage(SocketTopics.TOPIC_MACHINE_SERVICE)
        .subscribe((job: AppNotificationMessage) => {
          this.notifications.unshift(job);
          this.notifications = [...this.notifications];
        })
    );
  }

  isNotificationsEmpty() {
    if (!this.notifications) {
      return true;
    }
    return this.notifications.length === 0;
  }

  public onDone = (notification: AppNotificationMessage) => {
    notification.seen = true;

    this.subscriptions.push(
      this.userNotificationsService.update(notification).subscribe(
        (notification) => {
          console.log(notification);
          let index = this.notifications.findIndex(
            (element) => element.id === notification.id
          );

          this.notifications.splice(index, 1);

          this.notifications = [...this.notifications];
        },
        (err) => {
          AppUtil.showErrorMessage(err);
          //TODO: show more appropriate message
        }
      )
    );
  };

  public getJob = (jobID: number): string => {
    switch (jobID) {
      case 1:
        return `Cleaning`;
      case 2:
        return `Service`;
    }
  };

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
