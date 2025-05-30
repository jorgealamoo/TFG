import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {EventPostComponent} from "../../components/event-post/event-post.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FooterComponent, HeaderComponent, EventPostComponent, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class MyEventsPage implements OnInit {
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
      const newEvents = await this.supabaseService.getJoinedEvents(
        this.userId,
        'all',
        'date_desc',
        this.limit,
        this.offset
      );

      this.events = [...this.events, ...newEvents];
      this.offset += this.limit;
      console.log('Loaded events:', this.events);

      if (event) event.target.complete();
      if (newEvents.length < this.limit && event) event.target.disabled = true;
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      this.loading = false;
    }
  }

  async ionViewWillEnter() {
    this.reset();
    this.userId = await this.supabaseService.getUserId();
    if (this.userId) {
      await this.loadMoreEvents();
    }
  }

  reset() {
    this.events = [];
    this.offset = 0;
    this.loading = false;
  }
}
