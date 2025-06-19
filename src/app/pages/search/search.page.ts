import {Component, ViewChild} from '@angular/core';
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
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  searchEvent: boolean = true;
  searchResults: any[] = [];
  limit: number = 5;
  offset: number = 0;
  loading: boolean = false;
  currentQuery: string = '';

  constructor(private supabaseService: SupabaseService) { }

  async ionViewWillEnter() {
    this.searchResults = [];
    this.offset = 0;
    this.currentQuery = '';
    this.infiniteScroll.disabled = false;
    await this.loadMoreEvents();
  }

  async onSearch(query: string) {
    this.currentQuery = query.trim();
    this.offset = 0;
    this.searchResults = [];
    this.infiniteScroll.disabled = false;

    if (!this.currentQuery) {
      this.infiniteScroll.disabled = true;
      return;
    }

    await this.loadMoreEvents();
  }

  async loadMoreEvents(event?: any) {
    if (this.loading) {
      event?.target.complete();
      return;
    }
    this.loading = true;

    try {
      let newEvents: any[];

      if (this.currentQuery) {
        newEvents = await this.supabaseService.searchEventsPaginated(
          this.currentQuery,
          this.limit,
          this.offset
        );
      } else {
        newEvents = await this.supabaseService.getRecommendedEvents(
          this.limit,
          this.offset
        );
      }

      this.searchResults.push(...newEvents);
      this.offset += newEvents.length;

      if (newEvents.length < this.limit) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    } catch (error) {
      console.error('Error loading more events:', error);
    }

    this.loading = false;
    event?.target.complete();
  }
}
