import {Component, Input, OnInit} from '@angular/core';
import {IonButton, IonFooter, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-event-footer',
  templateUrl: './event-footer.component.html',
  styleUrls: ['./event-footer.component.scss'],
  imports: [
    IonFooter,
    IonToolbar,
    NgOptimizedImage,
    IonButton,
    NgIf
  ]
})
export class EventFooterComponent implements OnInit {
  @Input() eventId!: string;
  joined: boolean = false;
  due: string = "0.00";

  constructor(private supabase: SupabaseService) { }

  async ngOnInit() {
    try {
      const userId = await this.supabase.getUserId();
      if (!userId) {
        console.warn('User not logged in. Cannot check event participation.');
        return;
      }

      const event = await this.supabase.getEventById(this.eventId);
      if (!event) {
        console.error(`Event with ID ${this.eventId} not found.`);
        return;
      }

      this.joined = event.participants?.includes(userId) ?? false;
    } catch (error) {
      console.error('An error occurred while initializing event footer:', error);
    }
  }

  async joinEvent() {
    try {
      const userId = await this.supabase.getUserId();
      if (!userId) {
        console.warn('User not logged in. Cannot join the event.');
        return;
      }

      await this.supabase.joinEvent(userId, this.eventId);
      this.joined = true;
      console.log('User successfully joined the event.');
    } catch (error) {
      console.error('An error occurred while trying to join the event:', error);
    }
  }

  goToMoreInfo() {
    console.log('More info');
  }
}
