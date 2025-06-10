import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonText} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {TotalPriceComponent} from "../total-price/total-price.component";

@Component({
  selector: 'app-split-costs-automatically',
  templateUrl: './split-costs-automatically.component.html',
  styleUrls: ['./split-costs-automatically.component.scss'],
  imports: [
    IonText,
    NgIf,
    TotalPriceComponent
  ]
})
export class SplitCostsAutomaticallyComponent {
  @Input() splitCostsEnabled = true;
  @Input() entryPrice: number = 0;
  @Output() splitCostsEnabledChange = new EventEmitter<boolean>();
  @Output() entryPriceChange = new EventEmitter<number>();

  constructor() { }

  onToggleChange(event: Event): void {
    this.entryPrice = 0;
    const input = event.target as HTMLInputElement;
    this.splitCostsEnabled = input.checked;
    this.splitCostsEnabledChange.emit(this.splitCostsEnabled);
    this.entryPriceChange.emit(this.entryPrice);
  }

  onEntryPriceChange(newVal: number) {
    this.entryPrice = newVal;
    this.entryPriceChange.emit(this.entryPrice);
  }

}
