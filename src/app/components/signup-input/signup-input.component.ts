import {Component, Input} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-signup-input',
    templateUrl: './signup-input.component.html',
    styleUrls: ['./signup-input.component.scss'],
  imports: [
    IonInput,
    IonItem,
    ReactiveFormsModule
  ]
})
export class SignupInputComponent {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() placeholder: string = "Text";
  @Input() name: string = "";

  constructor() { }

}
