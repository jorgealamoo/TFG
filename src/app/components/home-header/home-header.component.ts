import { Component, OnInit } from '@angular/core';
import {IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    NgOptimizedImage
  ]
})
export class HomeHeaderComponent  implements OnInit {

  constructor() { }

  openNotifications() {
    console.log('Notifications opened');
  }

  ngOnInit() {}

}
