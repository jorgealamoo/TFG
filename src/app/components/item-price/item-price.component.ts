import { Component } from '@angular/core';
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";

@Component({
    selector: 'app-item-price',
    templateUrl: './item-price.component.html',
    styleUrls: ['./item-price.component.scss'],
  imports: [
    IonInput,
    IonItem,
    IonText
  ]
})
export class ItemPriceComponent{

  constructor() { }


}
