import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, EventHeaderComponent]
})
export class EventPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const eventId = params.get('id');
      if (eventId) {
        try {
          const event = await this.supabase.getEventById(eventId);
          console.log('Loaded event:', event);
        } catch (error) {
          console.error('Failed to load event details. Please try again later.', error);
        }
      }
    });
  }

}
