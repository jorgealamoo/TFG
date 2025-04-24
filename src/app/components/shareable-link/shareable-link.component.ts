import { Component, OnInit } from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";
import {EventFormDataService} from "../../services/event-form-data.service";

@Component({
  selector: 'app-shareable-link',
  templateUrl: './shareable-link.component.html',
  styleUrls: ['./shareable-link.component.scss'],
  imports: [
    IonItem,
    IonInput,
    FormsModule
  ]
})
export class ShareableLinkComponent  implements OnInit {
  shareableLink: string = 'https://example.com/shareable-link';

  constructor(private eventFormDataService: EventFormDataService) { }

  ngOnInit() {
    const eventUuid = this.eventFormDataService.getData().uuid;
    if (eventUuid) {
      this.shareableLink = `https://evnet.com/event/${eventUuid}`;
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareableLink).then(() => {
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
