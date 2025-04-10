import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent, IonLabel, NavController} from "@ionic/angular/standalone";
import {EventImagesInputComponent} from "../../components/event-images-input/event-images-input.component";
import {EventInputComponent} from "../../components/event-input/event-input.component";
import {
  EventDescriptionInputComponent
} from "../../components/event-description-input/event-description-input.component";
import {EventCategorySelectComponent} from "../../components/event-category-select/event-category-select.component";
import {EventDateInputComponent} from "../../components/event-date-input/event-date-input.component";
import {EventHourInputComponent} from "../../components/event-hour-input/event-hour-input.component";
import {EventPrivacySelectComponent} from "../../components/event-privacy-select/event-privacy-select.component";
import {EventFormDataService} from "../../services/event-form-data.service";
import {Router} from "@angular/router";
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, EventImagesInputComponent, EventInputComponent, ReactiveFormsModule, EventDescriptionInputComponent, EventCategorySelectComponent, EventDateInputComponent, EventHourInputComponent, EventPrivacySelectComponent, IonLabel, FooterComponent]
})
export class CreateEventPage {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categories: new FormControl(''),
    location: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    hour: new FormControl('', [Validators.required]),
    privacy: new FormControl('', [Validators.required]),
  })

  constructor(
    private eventFormDataService: EventFormDataService,
    private router: Router
  ) { }

  goToNextPage() {
    this.eventFormDataService.setData('title', this.form.controls.title.value);
    this.eventFormDataService.setData('description', this.form.controls.description.value);
    this.eventFormDataService.setData('categories', this.form.controls.categories.value);
    this.eventFormDataService.setData('location', this.form.controls.location.value);
    this.eventFormDataService.setData('date', this.form.controls.date.value);
    this.eventFormDataService.setData('hour', this.form.controls.hour.value);
    this.eventFormDataService.setData('privacy', this.form.controls.privacy.value);

    this.router.navigate(['/create-event-shopping-list']);
    console.log(this.eventFormDataService.getData());
  }

  isTitleTouched() {
    return this.form.controls.title.touched;
  }

  isDescriptionTouched() {
    return this.form.controls.description.touched;
  }

  isLocationTouched() {
    return this.form.controls.location.touched;
  }

  isDateTouched() {
    return this.form.controls.date.touched;
  }

  isHourTouched() {
    return this.form.controls.hour.touched;
  }

  isPrivacyTouched() {
    return this.form.controls.privacy.touched;
  }
}
