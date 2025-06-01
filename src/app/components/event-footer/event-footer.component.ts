import {Component, Input} from '@angular/core';
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
export class EventFooterComponent {
  @Input() eventId!: string;
  joined: boolean = false;
  due: string = "0.00";

  constructor(private supabase: SupabaseService) { }

  async ionViewWillEnter() {
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

      const participants = event.participants ?? [];
      this.joined = event.participants?.includes(userId) ?? false;

      if (this.joined) {
        if (event.split_costs_enabled) {
          const participantCount = participants.length || 1;
          const dueAmount = Number(event.total_price) / participantCount;
          this.due = dueAmount.toFixed(2);
        } else {
          this.due = Number(event.entry_price).toFixed(2);
        }
      }
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

      const updatedEvent = await this.supabase.getEventById(this.eventId);
      const updatedParticipants = updatedEvent.participants ?? [];
      if (updatedEvent.split_costs_enabled) {
        const dueAmount = Number(updatedEvent.total_price) / (updatedParticipants.length || 1);
        this.due = dueAmount.toFixed(2);
      } else {
        this.due = Number(updatedEvent.entry_price).toFixed(2);
      }

      console.log('User successfully joined the event.');
    } catch (error) {
      console.error('An error occurred while trying to join the event:', error);
    }
  }

  goToMoreInfo() {
    console.log('More info');
  }
}
