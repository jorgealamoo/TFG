import {Component, Input} from '@angular/core';
import {IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-event-category-select',
  templateUrl: './event-category-select.component.html',
  styleUrls: ['./event-category-select.component.scss'],
  imports: [
    IonSelect,
    ReactiveFormsModule,
    IonSelectOption,
    NgForOf
  ]
})
export class EventCategorySelectComponent {
  @Input() control!: FormControl;

  categories: string[] = [
    'Music',
    'Sports',
    'Art',
    'Food',
    'Technology',
    'Education',
    'Health',
    'Business',
    'Travel',
    'Lifestyle'
  ]

  constructor() { }


}
