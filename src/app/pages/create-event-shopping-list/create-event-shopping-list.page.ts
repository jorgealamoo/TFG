import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent, IonText} from "@ionic/angular/standalone";
import {ItemNameComponent} from "../../components/item-name/item-name.component";
import {ItemPriceComponent} from "../../components/item-price/item-price.component";
import {TotalPriceComponent} from "../../components/total-price/total-price.component";

@Component({
  selector: 'app-create-event-shopping-list',
  templateUrl: './create-event-shopping-list.page.html',
  styleUrls: ['./create-event-shopping-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonText, ItemNameComponent, ItemPriceComponent, TotalPriceComponent]
})
export class CreateEventShoppingListPage {
  shoppingListItems = [
    { name: '', price: 0 },
    { name: '', price: 0 },
    { name: '', price: 0 }
  ];
  totalPrice: number = 0;

  constructor() {

  }

  addItem() {
    this.shoppingListItems.push({ name: '', price: 0 });
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = this.shoppingListItems.reduce((sum, item) => sum + item.price, 0);
  }

  goToNextPage() {
    console.log(this.shoppingListItems);
    console.log("Total price: " + this.totalPrice);
  }
}
