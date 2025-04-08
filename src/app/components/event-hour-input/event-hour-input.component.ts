import {Component, Input} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-event-hour-input',
    templateUrl: './event-hour-input.component.html',
    styleUrls: ['./event-hour-input.component.scss'],
  imports: [
    IonInput,
    IonItem,
    ReactiveFormsModule
  ]
})
export class EventHourInputComponent {
  @Input() control!: FormControl;

  constructor() { }


}
