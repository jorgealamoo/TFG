import {Component, EventEmitter, Output} from '@angular/core';
import {IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-shopping-list-participants-switch',
  templateUrl: './shopping-list-participants-switch.component.html',
  styleUrls: ['./shopping-list-participants-switch.component.scss'],
  imports: [
    IonSegment,
    IonSegmentButton,
    FormsModule
  ]
})
export class ShoppingListParticipantsSwitchComponent {
  selectedView: string = "shoppingList";
  @Output() viewChange = new EventEmitter<string>();

  constructor() { }

  onSegmentChange(event: CustomEvent) {
    const value = event.detail.value;
    if (typeof value === 'string') {
      this.selectedView = value;
      this.viewChange.emit(value);
    }
  }

}
