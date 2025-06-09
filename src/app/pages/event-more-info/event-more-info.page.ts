import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {
  ShoppingListParticipantsSwitchComponent
} from "../../components/shopping-list-participants-switch/shopping-list-participants-switch.component";
import {ItemNameComponent} from "../../components/item-name/item-name.component";
import {ItemPriceComponent} from "../../components/item-price/item-price.component";
import {
  SplitCostsAutomaticallyComponent
} from "../../components/split-costs-automatically/split-costs-automatically.component";
import {TotalPriceComponent} from "../../components/total-price/total-price.component";
import {LeaveEventButtonComponent} from "../../components/leave-event-button/leave-event-button.component";

@Component({
  selector: 'app-event-more-info',
  templateUrl: './event-more-info.page.html',
  styleUrls: ['./event-more-info.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, EventHeaderComponent, ShoppingListParticipantsSwitchComponent, ItemNameComponent, ItemPriceComponent, SplitCostsAutomaticallyComponent, TotalPriceComponent, LeaveEventButtonComponent]
})
export class EventMoreInfoPage {
  title: string = "Event Name";
  selectedView: string = 'shoppingList';

  shoppingListItems = [
    { name: '', price: 0 },
    { name: '', price: 0 },
    { name: '', price: 0 }
  ];
  totalPrice: number = 0;

  constructor() { }

  onViewChange(view: string) {
    this.selectedView = view;
  }

  updateTotalPrice() {
    const rawTotal = this.shoppingListItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    this.totalPrice = Math.round(rawTotal * 100) / 100;
  }

  addItem() {
    this.shoppingListItems.push({ name: '', price: 0 });
    this.updateTotalPrice();
  }

}
