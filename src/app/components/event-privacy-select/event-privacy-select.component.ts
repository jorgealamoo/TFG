import {Component, Input} from '@angular/core';
import {IonItem, IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-event-privacy-select',
  templateUrl: './event-privacy-select.component.html',
  styleUrls: ['./event-privacy-select.component.scss'],
  imports: [
    IonItem,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule
  ]
})
export class EventPrivacySelectComponent {
  @Input() control!: FormControl;

  constructor() { }


}
