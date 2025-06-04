import { Component } from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: 'app-change-password-button',
  templateUrl: './change-password-button.component.html',
  styleUrls: ['./change-password-button.component.scss'],
  imports: [
    IonButton
  ]
})
export class ChangePasswordButtonComponent{

  constructor() { }

  changePassword() {

  }
}
