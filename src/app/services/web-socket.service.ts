import { CoreUtil } from './../common/core-util';
import { AppUtil } from './../common/app-util';
import {
  first,
  filter,
  switchMap,
  map,
  catchError,
  take,
} from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { User } from './../model/user';
import { BehaviorSubject, Observable, throwError, of, Subject } from 'rxjs';
import * as Stomp from 'stompjs';

import { SocketClientState, SocketTopics } from './../shared/util/socket-util';
import { AppConsts } from './../common/consts';
import { UserNotificationsService } from './user-notifications.service';
import { AppNotificationMessage } from '../model/app-notification-message';

// import * as socketIO from 'socket.io-client';
const socketIO = require('socket.io-client');
import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private static readonly URL = `${AppConsts.BASE_URL}`;
  private stompClient: Stomp.Client;
  private socket;

  private sockectState: BehaviorSubject<SocketClientState>;
  private readonly RECONNECT_DELAY_SECS = 5;
  private readonly stompTopicSubscriptionSubjects = new Map<
    string,
    Subject<any>
  >();

  constructor(private notificationService: UserNotificationsService) {
    for (const topicKey of Object.keys(SocketTopics)) {
      this.stompTopicSubscriptionSubjects.set(
        SocketTopics[topicKey],
        new Subject<any>()
      );
    }

    this.sockectState = new BehaviorSubject<SocketClientState>(
      SocketClientState.ATTEMPTING
    );
    this.initSocketConnection(WebSocketService.URL);
    this.listenToAllTopics();
  }

  public send(message: AppNotificationMessage): void {
    if (!AppUtil.hasValue(message.topic)) {
      throw new Error('Cannot sent message because topic is not defined');
    }
    this.connectToSocket()
      .pipe(first())
      .subscribe((client) =>
        client.send(
          `/rquiz-socket${message.topic}`,
          {},
          JSON.stringify(message)
        )
      );
  }

  public onMessage(
    topic: string,
    messageHandler = this.jsonHandler,
    ignoreErrors = true
  ): Observable<AppNotificationMessage> {
    const topicSubject: Subject<any> =
      this.stompTopicSubscriptionSubjects.get(topic);
    if (!topicSubject) {
      console.error(`Cannot find subscription for topic ${topic}`);
      return of(null);
    }
    return topicSubject.asObservable().pipe(
      switchMap((message) => {
        return of(message).pipe(
          map((msg: string) => {
            return messageHandler.call(this, msg);
          }),
          catchError((error) => {
            if (ignoreErrors === true) {
              return of(null);
            }
            return throwError(error);
          })
        );
      })
    );
  }

  private initSocketConnection(url: string): void {
    this.socket = new socketIO(url);

    this.socket.on('connect', () => this.socketConnectedCallback());

    this.socket.on('connect_error', (error) => {
      this.socketFailedToConnectCallback.call(this, error);
    });
  }

  private listenToAllTopics(): void {
    this.connectToSocket()
      .pipe(first())
      .subscribe((socket: any) => {
        const stompTopicsIterator = this.stompTopicSubscriptionSubjects.keys();
        let currTopic: string = stompTopicsIterator.next().value;

        while (AppUtil.hasValue(currTopic)) {
          const subscription: any = socket.subscribe(
            `/topic${currTopic}`,
            (message: any) => {
              const messageDestination: string = message
                ? message.headers['destination']
                : null;
              const topic: string = messageDestination
                ? CoreUtil.removePrefix(messageDestination, '/topic')
                : '';
              this.handleNotificationFromTopic(
                message ? message.body : null,
                topic
              );
            }
          );
          currTopic = stompTopicsIterator.next().value;
        }
      });
  }

  private connectToSocket(): Observable<any> {
    return this.sockectState
      .pipe(filter((state) => state === SocketClientState.CONNECTED))
      .pipe(
        switchMap((state: SocketClientState) => {
          return of(this.socket);
        })
      );
  }

  private socketConnectedCallback(): void {
    this.sockectState.next(SocketClientState.CONNECTED);
  }

  ngOnDestroy(): void {
    this.connectToSocket()
      .pipe(first())
      .subscribe((client: Stomp.Client) => client.disconnect(null));
  }

  private handleNotificationFromTopic(message: string, topic: string): void {
    const topicSubject: Subject<any> =
      this.stompTopicSubscriptionSubjects.get(topic);
    if (AppUtil.hasValue(topicSubject)) {
      topicSubject.next(message);
    }

    try {
      const appNotificationMessage = message
        ? (JSON.parse(message) as AppNotificationMessage)
        : null;
      Object.setPrototypeOf(
        appNotificationMessage,
        AppNotificationMessage.prototype
      );
      this.notificationService.updateCurrentUserNotificationsIfNecessary(
        appNotificationMessage
      );
    } catch (ex) {}
  }

  private jsonHandler(messageString: string): any {
    if (!messageString) {
      return null;
    }

    return JSON.parse(messageString);
  }

  private socketFailedToConnectCallback(error: string | Stomp.Frame): void {
    this.sockectState.next(SocketClientState.ERROR);
    console.error('Unable to connect to STOMP endpoint, error:', error);
    console.error(
      `Trying to connect again in ${this.RECONNECT_DELAY_SECS} seconds`
    );
    setTimeout(() => {
      this.initSocketConnection(WebSocketService.URL);
    }, this.RECONNECT_DELAY_SECS * 1000);
  }
}
