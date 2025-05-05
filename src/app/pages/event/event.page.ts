import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute} from "@angular/router";
import {IonAvatar, IonContent} from "@ionic/angular/standalone";
import {EventImageCarouselComponent} from "../../components/event-image-carousel/event-image-carousel.component";

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, EventHeaderComponent, IonContent, EventImageCarouselComponent, IonAvatar, NgOptimizedImage]
})
export class EventPage implements OnInit {
  public event: any;
  public imageUrls: string[] = [];
  public creatorUsername: string | null = null;
  public creatorProfileImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) {
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const eventId = params.get('id');
      if (eventId) {
        try {
          const event = await this.supabase.getEventById(eventId);
          this.event = event;
          this.imageUrls = event.images.map((path: string) =>
            this.supabase.getEventImageUrl(path)
          );
          this.creatorProfileImageUrl = await this.supabase.getUserProfileImage(event.creator_user);
          this.creatorUsername = await this.supabase.getUsernameById(event.creator_user);
          console.log('Loaded event:', event);
        } catch (error) {
          console.error('Failed to load event details. Please try again later.', error);
        }
      }
    });
  }

  get formattedHour(): string | null {
    if (!this.event?.hour) return null;
    return this.event.hour.slice(0, 5);
  }


}
