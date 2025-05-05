import { Component, OnInit } from '@angular/core';
import {IonButton, IonFooter, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-event-footer',
  templateUrl: './event-footer.component.html',
  styleUrls: ['./event-footer.component.scss'],
  imports: [
    IonFooter,
    IonToolbar,
    NgOptimizedImage,
    IonButton,
    NgIf
  ]
})
export class EventFooterComponent  implements OnInit {
  joined = false;
  due: string = "0.00";

  constructor() { }

  ngOnInit() {}

  goToMoreInfo() {
    console.log('More info');
  }

  joinEvent() {
    this.joined = true;
  }
}
