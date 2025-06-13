import {Component, Input, OnInit} from '@angular/core';
import {IonButton, IonButtons} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-invitation-notification',
  templateUrl: './invitation-notification.component.html',
  styleUrls: ['./invitation-notification.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    NgIf
  ]
})
export class InvitationNotificationComponent implements OnInit {
  userId: string | null = null;

  @Input() eventId: string | null = null;
  @Input() notificationId: string = "";
  @Input() notificationData: any;
  @Input() notificationType: string = "";

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit() {
    await this.supabaseService.markNotificationAsRead(this.notificationId)

    if (this.notificationType === "event_invitation"){
      this.eventId = this.notificationData.event_id;
      this.userId = await this.supabaseService.getUserId()
    }
  }

  onAccept() {
    if (this.eventId && this.userId) {
      this.supabaseService.joinEvent(this.userId, this.eventId)
        .then(async () => {
          this.notificationType = "event_invitation_accepted";
          await this.supabaseService.updateNotificationType(this.notificationId, this.notificationType)
          console.log("Successfully joined event:", this.eventId);
        })
        .catch(error => {
          console.error('Error joining event:', error);
        });
    }
  }

  async onDecline() {
    if (this.eventId && this.userId) {
      this.notificationType = "event_invitation_declined";
      await this.supabaseService.updateNotificationType(this.notificationId, this.notificationType)
    }
  }

  goToEvent() {
    if (this.eventId) {
      this.router.navigate(['event', this.eventId]);
    }
  }
}
