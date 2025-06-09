import {Component, Input} from '@angular/core';
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

  constructor() { }

  onToggleChange(event: Event): void {
    this.entryPrice = 0;
    const input = event.target as HTMLInputElement;
    this.splitCostsEnabled = input.checked;
  }

}
