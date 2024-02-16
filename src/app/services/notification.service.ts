import { Injectable } from '@angular/core';
import {INotification, NotificationType} from "../interfaces/notification.interface";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // @ts-ignore
  private _notification$: BehaviorSubject<INotification> = new BehaviorSubject(null);

  success(message: string, duration: number=3000) {
    this.notify(message, NotificationType.Success, duration);
  }
  warning(message: string, duration: number = 3000) {
    this.notify(message, NotificationType.Warning, duration);
  }
  error(message: string, duration: number = 3000) {
    this.notify(message, NotificationType.Error, duration);
  }
  private notify(message: string, type: NotificationType,       duration: number) {
    duration = !duration ? 3000 : duration;
    this._notification$.next({
      message: message,
      type: type,
      duration: duration
    } as INotification);
  }
  get notification() {
    return this._notification$.asObservable();
  }
}
