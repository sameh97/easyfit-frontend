import { SocketTopics } from '../shared/util/socket-util';

export class AppNotificationMessage {
  id: number;
  content: any;
  topic: string;
  gymId: number;
  // username: string;
  // time: Date;
  seen: boolean;
  targetObjectId: string;
  createdAt: Date;
  updatedAt: Date;
  // targetUserIds: string[];

  constructor(data: any, topic: string, gymId: number) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    this.content = data;
    this.gymId = gymId;
    // this.username = username;
    this.topic = topic;
    // this.targetUserIds = data.targetUserIds ? data.targetUserIds : null;
    // this.time = new Date();
  }

  // public isUserTargeted(userId: string): boolean {
  //   if (!userId || !this.targetUserIds) {
  //     return false;
  //   }
  //   for (const targetUserId of this.targetUserIds) {
  //     if (userId === targetUserId) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // public shouldAppearInUserNotifications(userId: string): boolean {
  //   if (!this.topic) {
  //     console.error(`Notification ${this.id} topic is undefined`);
  //     return false;
  //   }
  //   if (
  //     this.topic.toLowerCase() ===
  //       SocketTopics.TOPIC_CLEAN_MACHINE.toLowerCase() ||
  //     this.topic.toLowerCase() ===
  //       SocketTopics.TOPIC_MACHINE_SERVICE.toLowerCase() ||
  //     this.topic.toLowerCase() ===
  //       SocketTopics.TOPIC_MEMBER_EXPIRED.toLowerCase()
  //   ) {
  //     if (this.isUserTargeted(userId)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
