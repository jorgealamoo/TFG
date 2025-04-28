import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() maxParticipants: number = 20;
  @Output() maxParticipantsChange = new EventEmitter<number>();

  @Input() maxParticipantsEnabled: boolean = true;
  @Output() maxParticipantsEnabledChange = new EventEmitter<boolean>();

  constructor() { }

  onMaxParticipantsEnabledChange(value: boolean) {
    this.maxParticipantsEnabled = value;
    this.maxParticipantsEnabledChange.emit(this.maxParticipantsEnabled);
  }

  onMaxParticipantsChange(value: number) {
    this.maxParticipants = value;
    this.maxParticipantsChange.emit(this.maxParticipants);
  }
}
