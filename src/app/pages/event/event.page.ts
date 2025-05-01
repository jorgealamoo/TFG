import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute} from "@angular/router";
import {IonContent} from "@ionic/angular/standalone";
import {EventImageCarouselComponent} from "../../components/event-image-carousel/event-image-carousel.component";

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, EventHeaderComponent, IonContent, EventImageCarouselComponent]
})
export class EventPage implements OnInit {
  public imageUrls: string[] = [];

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
          this.imageUrls = event.images.map((path: string) =>
            this.supabase.getEventImageUrl(path)
          );
          console.log('Loaded event:', event);
        } catch (error) {
          console.error('Failed to load event details. Please try again later.', error);
        }
      }
    });
  }

}
