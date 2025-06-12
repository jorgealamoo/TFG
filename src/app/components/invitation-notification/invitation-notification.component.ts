import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonButton, IonButtons} from "@ionic/angular/standalone";

@Component({
  selector: 'app-invitation-notification',
  templateUrl: './invitation-notification.component.html',
  styleUrls: ['./invitation-notification.component.scss'],
  imports: [
    IonButton,
    IonButtons
  ]
})
export class InvitationNotificationComponent {
  @Input() notificationText: string = 'Notification';
  @Output() acceptClicked = new EventEmitter<void>();
  @Output() declineClicked = new EventEmitter<void>();

  constructor() { }

  onAccept() {
    this.acceptClicked.emit();
  }

  onDecline() {
    this.declineClicked.emit();
  }
}
