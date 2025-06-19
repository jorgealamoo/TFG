import {Component, EventEmitter, Input, Output, SimpleChanges, OnChanges} from '@angular/core';
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
export class SearchBarComponent implements OnChanges {
  searchText: string = "";
  @Input() value: string = '';
  @Output() searchChange = new EventEmitter<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && changes['value'].currentValue !== this.searchText) {
      this.searchText = changes['value'].currentValue;
    }
  }

  onSearch() {
    this.searchChange.emit(this.searchText.trim());
  }
}
