import {Component, Input} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";

@Component({
  selector: 'app-edit-profile-input',
  templateUrl: './edit-profile-input.component.html',
  styleUrls: ['./edit-profile-input.component.scss'],
  imports: [
    IonInput,
    IonItem
  ]
})
export class EditProfileInputComponent {
  @Input() input_title: string = "Username";
  @Input() input_value!: string;

  constructor() { }

}
