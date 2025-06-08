import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SupabaseService} from "../../services/supabase.service";
import {EventPostComponent} from "../../components/event-post/event-post.component";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FooterComponent, HeaderComponent, SearchBarComponent, EventPostComponent, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class SearchPage {
  searchEvent: boolean = true;
  searchResults: any[] = [];
  limit: number = 5;
  offset: number = 0;
  loading: boolean = false;
  currentQuery: string = '';

  constructor(private supabaseService: SupabaseService) { }

  async ionViewWillEnter() {
    this.loading = true;
    try {
      this.searchResults = await this.supabaseService.getRecommendedEvents(this.limit, 0);
      this.currentQuery = '';
      this.offset = this.searchResults.length;
    } catch (error) {
      console.error('Error loading recommended events:', error);
    }
    this.loading = false;
  }

  async onSearch(query: string) {
    if (!query) {
      this.searchResults = [];
      return;
    }

    this.currentQuery = query;
    this.offset = 0;
    this.loading = true;

    if (this.searchEvent) {
      try {
        this.searchResults = await this.supabaseService.searchEventsPaginated(query, this.limit, this.offset);
      } catch (error) {
        console.error('Error loading search results:', error);
      }
    }

    this.loading = false;
  }

  async loadMoreEvents(event: any) {
    if (this.loading || !this.currentQuery) {
      event.target.complete();
      return;
    }

    this.loading = true;
    this.offset += this.limit;

    try {
      const newEvents = await this.supabaseService.searchEventsPaginated(this.currentQuery, this.limit, this.offset);
      this.searchResults = [...this.searchResults, ...newEvents];

      if (newEvents.length < this.limit) {
        event.target.disabled = true;
      }
    } catch (error) {
      console.error('Error loading more events:', error);
    }

    this.loading = false;
    event.target.complete();
  }
}
