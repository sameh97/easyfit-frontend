import { ROUTE_NAMES } from './../../common/consts';
// import { Quiz } from '../models/quiz';
// import { AppNotificationMessage } from '../models/app-notification-message';

export enum SocketClientState {
  ATTEMPTING,
  CONNECTED,
  ERROR,
}

export interface StompMessage {
  body: string;
}

export function textHandler(message: StompMessage): string {
  return message.body;
}

export const SocketTopics = {
  TOPIC_CLEAN_MACHINE: '/clean-machine',
  TOPIC_MACHINE_SERVICE: '/machine-service',
  TOPIC_MEMBER_EXPIRED: '/user-expired',
  TOPIC_SEND_CLIENT_DATA_TO_SERVER: 'send-client-data',
};

// export function createNotificationMessageText(
//   notification: AppNotificationMessage
// ): string {
//   if (!notification) {
//     return '';
//   }

//   if (
//     notification.topic.toLowerCase() ===
//     SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()
//   ) {
//     const quiz: Quiz = JSON.parse(notification.content);
//     return `${notification.username} solved your quiz: ${quiz.title}`;
//   }

//   if (
//     notification.topic.toLowerCase() ===
//     SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()
//   ) {
//     const quiz: Quiz = JSON.parse(notification.content);
//     return `${notification.username} assigned a quiz to you. Quiz title: ${quiz.title}`;
//   }

//   return `You got a notification from user: ${notification.username}`;
// }

// export function createNotificationRouteUrl(
//   notification: AppNotificationMessage
// ): string {
//   if (!notification) {
//     return '';
//   }

//   if (
//     notification.topic.toLowerCase() ===
//     SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE.toLowerCase()
//   ) {
//     return ROUTE_NAMES.MY_QUIZ_LIST.name;
//   }

//   if (
//     notification.topic.toLowerCase() ===
//     SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER.toLowerCase()
//   ) {
//     return ROUTE_NAMES.MY_ASSIGNED_QUIZ_LIST.name;
//   }

//   return '/';
// }
