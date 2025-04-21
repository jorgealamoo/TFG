import { Component } from '@angular/core';
import {IonInput, IonItem} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [
    IonInput,
    FormsModule,
    IonItem
  ]
})
export class SearchBarComponent {
  searchText: string = "";

  constructor() { }

  onSearch() {
    console.log('Searching:', this.searchText);
  }
}
