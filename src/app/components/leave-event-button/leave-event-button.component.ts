import { Component } from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-leave-event-button',
  templateUrl: './leave-event-button.component.html',
  styleUrls: ['./leave-event-button.component.scss'],
  imports: [
    IonButton,
    NgOptimizedImage
  ]
})
export class LeaveEventButtonComponent {

  constructor() { }

}
