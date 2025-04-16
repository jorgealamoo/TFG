import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-item-price',
    templateUrl: './item-price.component.html',
    styleUrls: ['./item-price.component.scss'],
  imports: [
    IonInput,
    IonItem,
    IonText,
    FormsModule
  ]
})
export class ItemPriceComponent{
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  get displayValue(): string {
    return this.value === 0 ? '' : String(this.value);
  }

  onInputChange(input: string) {
    const numericValue = parseFloat(input);
    this.valueChange.emit(isNaN(numericValue) ? 0 : numericValue);
  }

}
