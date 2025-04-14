import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent, IonText} from "@ionic/angular/standalone";
import {ShoppingListItemComponent} from "../../components/shopping-list-item/shopping-list-item.component";

@Component({
  selector: 'app-create-event-shopping-list',
  templateUrl: './create-event-shopping-list.page.html',
  styleUrls: ['./create-event-shopping-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonText, ShoppingListItemComponent, NgOptimizedImage]
})
export class CreateEventShoppingListPage {
  shoppingListItems = [ {} ];

  constructor() {

  }

  addItem() {
    this.shoppingListItems.push({});
  }

  goToNextPage() {

  }
}
