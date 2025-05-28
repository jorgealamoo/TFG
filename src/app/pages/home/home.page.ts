import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FooterComponent} from "../../components/footer/footer.component";
import {HomeHeaderComponent} from "../../components/home-header/home-header.component";
import {SupabaseService} from "../../services/supabase.service";
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent} from "@ionic/angular/standalone";
import {EventPostComponent} from "../../components/event-post/event-post.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HomeHeaderComponent, FooterComponent, IonContent, EventPostComponent, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class HomePage implements OnInit {
  events: any[] = [];
  limit: number = 5;
  offset: number = 0;
  userId: string | null = null;
  loading: boolean = false;

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    this.userId = await this.supabaseService.getUserId();
    if (this.userId) {
      await this.loadMoreEvents();
    }
  }

  async loadMoreEvents(event?: any) {
    if (this.loading || !this.userId) return;

    this.loading = true;
    try {
      const newEvents = await this.supabaseService.getEventsFromFollowedUsers(
        this.userId,
        this.limit,
        this.offset
      );

      this.events = [...this.events, ...newEvents];
      this.offset += this.limit;
      console.log('Loaded events:', this.events);

      if (event) event.target.complete();
      if (newEvents.length < this.limit && event) event.target.disabled = true;
    } catch (error) {
      console.error('Failed to load more events. Please try again later.', error);
    } finally {
      this.loading = false;
    }
  }
}
