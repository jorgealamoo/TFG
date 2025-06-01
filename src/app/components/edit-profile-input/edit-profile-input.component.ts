import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonInput} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-profile-input',
  templateUrl: './edit-profile-input.component.html',
  styleUrls: ['./edit-profile-input.component.scss'],
  imports: [
    IonInput,
    FormsModule
  ]
})
export class EditProfileInputComponent {
  @Input() input_title: string = "Input title";
  @Input() input_value!: string;
  @Output() input_valueChange = new EventEmitter<string>();

  onInputChange(value: string) {
    this.input_valueChange.emit(value);
  }

  constructor() { }

}
