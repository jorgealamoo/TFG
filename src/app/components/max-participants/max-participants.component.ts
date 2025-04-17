import { Component } from '@angular/core';
import {IonCheckbox} from "@ionic/angular/standalone";

@Component({
  selector: 'app-max-participants',
  templateUrl: './max-participants.component.html',
  styleUrls: ['./max-participants.component.scss'],
  imports: [
    IonCheckbox
  ]
})
export class MaxParticipantsComponent {

  constructor() { }

}
