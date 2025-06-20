import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
  imports: [
    IonButton
  ]
})
export class AuthButtonComponent {

  @Input() label: string = "Submit";
  @Input() disabled: boolean = false;
  @Output() action: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }

  constructor() { }

}
