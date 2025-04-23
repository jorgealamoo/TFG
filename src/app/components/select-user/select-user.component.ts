import { Component } from '@angular/core';
import {IonCheckbox} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  imports: [
    IonCheckbox,
    FormsModule
  ]
})
export class SelectUserComponent {
  username: string = "Username";
  isSelected: boolean = false;

  constructor() { }

}
