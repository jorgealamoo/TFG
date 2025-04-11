import { Component } from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-item-name',
  templateUrl: './item-name.component.html',
  styleUrls: ['./item-name.component.scss'],
  imports: [
    IonInput,
    IonItem,
    ReactiveFormsModule
  ]
})
export class ItemNameComponent{

  constructor() { }


}
