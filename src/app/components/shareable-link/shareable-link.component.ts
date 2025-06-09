import {Component, Input, OnInit} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

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
  @Input() eventUuid!: string;

  constructor() { }

  ngOnInit() {
    if (this.eventUuid) {
      this.shareableLink = `https://evnet.com/event/${(this.eventUuid)}`;
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
