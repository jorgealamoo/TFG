import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IonItem, IonTextarea} from "@ionic/angular/standalone";

@Component({
  selector: 'app-event-description-input',
  templateUrl: './event-description-input.component.html',
  styleUrls: ['./event-description-input.component.scss'],
  imports: [
    IonItem,
    IonTextarea,
    ReactiveFormsModule
  ]
})
export class EventDescriptionInputComponent {
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Event description';
  @Input() name: string = '';

  constructor() { }


}
