import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent, IonText} from "@ionic/angular/standalone";
import {ItemNameComponent} from "../../components/item-name/item-name.component";
import {ItemPriceComponent} from "../../components/item-price/item-price.component";
import {TotalPriceComponent} from "../../components/total-price/total-price.component";
import {
  SplitCostsAutomaticallyComponent
} from "../../components/split-costs-automatically/split-costs-automatically.component";

@Component({
  selector: 'app-create-event-shopping-list',
  templateUrl: './create-event-shopping-list.page.html',
  styleUrls: ['./create-event-shopping-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonText, ItemNameComponent, ItemPriceComponent, TotalPriceComponent, SplitCostsAutomaticallyComponent]
})
export class CreateEventShoppingListPage {
  @ViewChild(SplitCostsAutomaticallyComponent)
  splitCostsComponent!: SplitCostsAutomaticallyComponent;

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
    const rawTotal = this.shoppingListItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    this.totalPrice = Math.round(rawTotal * 100) / 100;
  }

  goToNextPage() {
    console.log(this.shoppingListItems);
    console.log("Total price: " + this.totalPrice);

    if (this.splitCostsComponent) {
      console.log("Split costs enabled:", this.splitCostsComponent.splitCostsEnabled);
      console.log("Entry price:", this.splitCostsComponent.entryPrice);
    }
  }
}
