import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NotificationService} from "../../services/notification.service";
import {INotification, NotificationType} from "../../interfaces/notification.interface";
import {takeWhile} from "rxjs";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @ViewChild('notificationContainer') container!: ElementRef<HTMLDivElement>;

  private _subscribed: boolean = true;
  private classMap: Map<NotificationType, string> | undefined;

  constructor(
    private service: NotificationService,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.classMap = new Map<NotificationType, string>();
    this.classMap.set(NotificationType.Success, 'success');
    this.classMap.set(NotificationType.Warning, 'warning');
    this.classMap.set(NotificationType.Error, 'error');


  }
  ngAfterViewInit(){
    this.service.notification
      .pipe(takeWhile(() => this._subscribed))
      .subscribe(notification => {
        if(notification) this.render(notification);
      });
  }
  ngOnDestroy() {
    this._subscribed = false;
  }

  private render(notification: INotification) {
    let notificationBox = this.renderer.createElement('div');
    let header = this.renderer.createElement('b');
    let content = this.renderer.createElement('div');

    const boxColorClass = this.classMap?.get(notification.type);
    let classesToAdd = ['message-box', boxColorClass];

    classesToAdd.forEach(x =>  this.renderer.addClass(notificationBox, (typeof x === "string") ? x: ''));

    this.renderer.setStyle(notificationBox, 'transition', `opacity ${notification.duration}ms`);
    this.renderer.setStyle(notificationBox, 'opacity', '1');
    const headerText = this.renderer.createText(NotificationType[notification.type]);
    this.renderer.appendChild(header, headerText);
    const text = this.renderer.createText(notification.message);
    this.renderer.appendChild(content, text);
    this.renderer.appendChild(this.container.nativeElement, notificationBox);
    this.renderer.appendChild(notificationBox, header);
    this.renderer.appendChild(notificationBox, content);
    setTimeout(() => {
      this.renderer.setStyle(notificationBox, 'opacity', '0');
      setTimeout(() => {
        this.renderer.removeChild(this.container?.nativeElement, notificationBox);
      }, notification.duration);
    }, notification.duration);
  }
}
