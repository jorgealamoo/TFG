import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-item-name',
  templateUrl: './item-name.component.html',
  styleUrls: ['./item-name.component.scss'],
  imports: [
    IonInput,
    IonItem,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ItemNameComponent{
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  constructor() { }


}
