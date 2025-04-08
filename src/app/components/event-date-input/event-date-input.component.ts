import {Component, Input} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-event-date-input',
  templateUrl: './event-date-input.component.html',
  styleUrls: ['./event-date-input.component.scss'],
  imports: [
    IonItem,
    IonInput,
    ReactiveFormsModule
  ]
})
export class EventDateInputComponent {
  @Input() control!: FormControl;

  constructor() { }


}
