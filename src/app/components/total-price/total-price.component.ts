import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemPriceComponent} from "../item-price/item-price.component";

@Component({
  selector: 'app-total-price',
  templateUrl: './total-price.component.html',
  styleUrls: ['./total-price.component.scss'],
  imports: [
    ItemPriceComponent
  ]
})
export class TotalPriceComponent {
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  constructor() { }

}
