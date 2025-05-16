import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {EventImageCarouselComponent} from "../event-image-carousel/event-image-carousel.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-event-post',
  templateUrl: './event-post.component.html',
  styleUrls: ['./event-post.component.scss'],
  imports: [
    NgOptimizedImage,
    EventImageCarouselComponent,
    NgIf,
    DatePipe
  ]
})
export class EventPostComponent implements OnInit {
  @Input() event: any;
  imagesUrls: string[] = [];

  @Input() descriptionEnabled: boolean = true;

  constructor(private supabaseService: SupabaseService) { }

  openMoreOptions() {
    console.log('More options opened');
  }

  async ngOnInit() {
    if (this.event?.images?.length > 0) {
      this.imagesUrls = await Promise.all(
        this.event.images.map((path: string) =>
          this.supabaseService.getEventImageUrl(path)
        )
      );
    }
  }
}
