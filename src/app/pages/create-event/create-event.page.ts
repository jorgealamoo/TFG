import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HeaderComponent} from "../../components/header/header.component";
import {IonContent} from "@ionic/angular/standalone";
import {EventImagesInputComponent} from "../../components/event-images-input/event-images-input.component";
import {EventInputComponent} from "../../components/event-input/event-input.component";
import {RichTextEditorComponent} from "../../components/rich-text-editor/rich-text-editor.component";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, EventImagesInputComponent, EventInputComponent, ReactiveFormsModule, RichTextEditorComponent]
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

  constructor() { }

  isTitleTouched() {
    return this.form.controls.title.touched;
  }

  isDescriptionTouched() {
    return this.form.controls.description.touched;
  }

}
