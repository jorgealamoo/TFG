import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit() {}

  copyLink() {

  }
}
