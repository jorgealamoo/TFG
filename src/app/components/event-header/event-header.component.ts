import {Component, Input} from '@angular/core';
import {IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    NgIf,
    NgOptimizedImage
  ]
})
export class EventHeaderComponent {
  @Input() title: string = '';
  @Input() showShare: boolean = false;
  @Input() showSettings: boolean = false;

  constructor() { }

  goBack() {
    window.history.back();
  }

  onShare() {

  }

  onSettings() {

  }

  onGallery() {

  }

  onChat() {

  }
}
