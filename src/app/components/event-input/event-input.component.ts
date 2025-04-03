import {Component, Input} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-event-input',
  templateUrl: './event-input.component.html',
  styleUrls: ['./event-input.component.scss'],
  imports: [
    IonInput,
    IonItem,
    ReactiveFormsModule
  ]
})
export class EventInputComponent {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() placeholder: string = "Text";
  @Input() name: string = "";

  constructor() { }



}
