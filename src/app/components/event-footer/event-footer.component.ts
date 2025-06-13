import {Component, Input, OnInit} from '@angular/core';
import {IonButton, IonFooter, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";

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
  event: any = null;
  joined: boolean = false;
  due: string = "0.00";

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const userId = await this.supabase.getUserId();
      if (!userId) {
        console.warn('User not logged in. Cannot check event participation.');
        return;
      }

      this.event = await this.supabase.getEventById(this.eventId);
      if (!this.event) {
        console.error(`Event with ID ${this.eventId} not found.`);
        return;
      }

      const participants = this.event.participants ?? [];
      this.joined = this.event.participants?.includes(userId) ?? false;

      if (this.joined) {
        if (userId === this.event.creator_user) {
          this.due = '0.00';
        } else if (this.event.split_costs_enabled) {
          const participantCount = participants.length || 1;
          const dueAmount = Number(this.event.total_price) / participantCount;
          this.due = dueAmount.toFixed(2);
        } else {
          this.due = Number(this.event.entry_price).toFixed(2);
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
      if (userId === this.event.creator_user) {
        this.due = '0.00';
      } else if (updatedEvent.split_costs_enabled) {
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
    this.router.navigate(['/event-more-info', this.eventId])
  }
}
