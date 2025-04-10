import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent} from "@ionic/angular/standalone";

@Component({
  selector: 'app-create-event-shopping-list',
  templateUrl: './create-event-shopping-list.page.html',
  styleUrls: ['./create-event-shopping-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent]
})
export class CreateEventShoppingListPage {

  constructor() {

  }


  goToNextPage() {

  }
}
