import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {
  InvitationNotificationComponent
} from "../../components/invitation-notification/invitation-notification.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, InvitationNotificationComponent]
})
export class NotificationsPage {
  notifications: any[] = [];

  constructor(
    private supabaseService: SupabaseService
  ) { }

  async ionViewWillEnter() {
    this.notifications = await this.supabaseService.getNotificationsForUser();
  }

}
