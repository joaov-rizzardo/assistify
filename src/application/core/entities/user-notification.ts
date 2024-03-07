import {
  UserNotificationContentType,
  UserNotificationTypes,
} from './schemas/user-notification-schema';

type UserNotificationConstructor = {
  id: string;
  userId: string;
  type: UserNotificationTypes;
  content?: UserNotificationContentType;
  date: Date;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class UserNotification {
  private id: string;
  private userId: string;
  private type: UserNotificationTypes;
  private content?: UserNotificationContentType;
  private date: Date;
  private read: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(args: UserNotificationConstructor) {
    this.id = args.id;
    this.userId = args.userId;
    this.type = args.type;
    if (args.content) this.content = args.content;
    this.date = args.date;
    this.read = args.read;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getUserId() {
    return this.userId;
  }

  public getType() {
    return this.type;
  }

  public getContent() {
    return this.content;
  }

  public getDate() {
    return this.date;
  }

  public getRead() {
    return this.read;
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getUpdatedAt() {
    return this.updatedAt;
  }

  public toObject() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      content: this.content,
      date: this.date,
      read: this.read,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
