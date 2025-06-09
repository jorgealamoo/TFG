import {Component, OnInit, ViewChild} from '@angular/core';
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
import {EventFormDataService} from "../../services/event-form-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-event-shopping-list',
  templateUrl: './create-event-shopping-list.page.html',
  styleUrls: ['./create-event-shopping-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonText, ItemNameComponent, ItemPriceComponent, TotalPriceComponent, SplitCostsAutomaticallyComponent]
})
export class CreateEventShoppingListPage implements OnInit {
  @ViewChild(SplitCostsAutomaticallyComponent)
  splitCostsComponent!: SplitCostsAutomaticallyComponent;

  shoppingListItems = [
    { name: '', price: 0 },
    { name: '', price: 0 },
    { name: '', price: 0 }
  ];
  totalPrice: number = 0;

  constructor(
    private eventFormDataService: EventFormDataService,
    private router: Router
  ) {  }

  ngOnInit() {
    const eventData = this.eventFormDataService.getData();
    if (!eventData.uuid) {
      this.router.navigate(['/create-event']);
    }
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
    this.eventFormDataService.setData('shoppingList', this.shoppingListItems);
    this.eventFormDataService.setData('totalPrice', this.totalPrice);

    if (this.splitCostsComponent) {
      this.eventFormDataService.setData('splitCostsEnabled', this.splitCostsComponent.splitCostsEnabled);
      this.eventFormDataService.setData('entryPrice', this.splitCostsComponent.entryPrice);
    }

    this.router.navigate(['/create-event-participants']);
    console.log(this.eventFormDataService.getData());
  }

  removeItem(index: number) {
    this.shoppingListItems.splice(index, 1);
    this.updateTotalPrice();
  }
}
