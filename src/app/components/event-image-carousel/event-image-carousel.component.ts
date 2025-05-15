import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-event-image-carousel',
  templateUrl: './event-image-carousel.component.html',
  styleUrls: ['./event-image-carousel.component.scss'],
  standalone: true,
  imports: [
    NgForOf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventImageCarouselComponent {
  @Input() imageUrls: string[] = [];
  @Input() isEventPost: boolean = false;
}
