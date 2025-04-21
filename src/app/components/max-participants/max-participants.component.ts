import { Component } from '@angular/core';
import {IonCheckbox, IonInput, IonItem} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-max-participants',
  templateUrl: './max-participants.component.html',
  styleUrls: ['./max-participants.component.scss'],
  imports: [
    IonCheckbox,
    IonInput,
    FormsModule,
    IonItem
  ]
})
export class MaxParticipantsComponent {
  maxParticipants: number = 20;
  maxParticipantsEnabled: boolean = true;

  constructor() { }

}
