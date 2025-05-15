import {Component, Input, OnInit} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {EventImageCarouselComponent} from "../event-image-carousel/event-image-carousel.component";

@Component({
  selector: 'app-event-post',
  templateUrl: './event-post.component.html',
  styleUrls: ['./event-post.component.scss'],
  imports: [
    NgOptimizedImage,
    EventImageCarouselComponent,
    NgIf
  ]
})
export class EventPostComponent {
  @Input() profileImage: string = "assets/images/default_profile_image.png";
  @Input() creatorUsername: string = "username";
  @Input() eventName: string = "Event Name";
  @Input() eventImagesUrls: string[] = [];
  @Input() eventLocation: string = "Location";
  @Input() eventDate: string = "00/00/00";
  @Input() eventHour: string = "00:00";
  @Input() eventDescription: string = "Description super long ufbierybfouy\nbuyfweroubgverjhigb urthuiogh iofrbviougre ipogvboriyegbvioy io iuerhipu ghipipipipipipipip\n\nipoleriughpiuerhbn gperuig hpieur ghpeiru\n\n ghip heru gpirthn giprtngip tiur \n bfhuvbyhrfge  \n bnvhyecvygbevcuy \n\n nifguoyrfbvuy";

  @Input() descriptionEnabled: boolean = true;

  constructor() { }

  openMoreOptions() {
    console.log('More options opened');
  }
}
