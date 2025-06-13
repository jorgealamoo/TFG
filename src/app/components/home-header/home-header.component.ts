import {Component, Input} from '@angular/core';
import {IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

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
    NgOptimizedImage,
    NgIf
  ]
})
export class HomeHeaderComponent {
  @Input() hasUnread: boolean = false;

  constructor(private router: Router) { }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }

}
