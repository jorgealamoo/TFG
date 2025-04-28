import {Component, EventEmitter, Input, Output} from '@angular/core';
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

  @Output() nextClicked = new EventEmitter<void>();
  @Output() checkClicked = new EventEmitter<void>();

  constructor() { }

  goBack() {
    window.history.back();
  }

  onNext() {
    this.nextClicked.emit();
  }

  onCheck() {
    this.checkClicked.emit();
  }

}
