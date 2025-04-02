import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {IonButton, IonButtons, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    NgIf,
    NgOptimizedImage
  ]
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBack: boolean = false;
  @Input() showNext: boolean = false;
  @Input() showCheck: boolean = false;

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['../']);
  }

  onNext() {
    console.log('Next clicked');
  }

  onCheck() {
    console.log('Check clicked');
  }

}
