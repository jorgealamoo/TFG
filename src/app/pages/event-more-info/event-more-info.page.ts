import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {
  ShoppingListParticipantsSwitchComponent
} from "../../components/shopping-list-participants-switch/shopping-list-participants-switch.component";

@Component({
  selector: 'app-event-more-info',
  templateUrl: './event-more-info.page.html',
  styleUrls: ['./event-more-info.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, EventHeaderComponent, ShoppingListParticipantsSwitchComponent]
})
export class EventMoreInfoPage {
  title: string = "Event Name";
  selectedView: string = 'shoppingList';

  constructor() { }

  onViewChange(view: string) {
    this.selectedView = view;
  }

}
