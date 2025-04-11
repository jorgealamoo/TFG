import { Component } from '@angular/core';
import {ItemNameComponent} from "../item-name/item-name.component";
import {ItemPriceComponent} from "../item-price/item-price.component";

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
  imports: [
    ItemNameComponent,
    ItemPriceComponent
  ]
})
export class ShoppingListItemComponent {

  constructor() { }


}
