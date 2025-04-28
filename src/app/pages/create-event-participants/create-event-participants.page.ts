import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonText} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {MaxParticipantsComponent} from "../../components/max-participants/max-participants.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SelectUserComponent} from "../../components/select-user/select-user.component";
import {ShareableLinkComponent} from "../../components/shareable-link/shareable-link.component";
import {EventFormDataService} from "../../services/event-form-data.service";

@Component({
  selector: 'app-create-event-participants',
  templateUrl: './create-event-participants.page.html',
  styleUrls: ['./create-event-participants.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, MaxParticipantsComponent, IonText, SearchBarComponent, SelectUserComponent, ShareableLinkComponent]
})
export class CreateEventParticipantsPage {
  maxParticipants: number = 20;
  maxParticipantsEnabled: boolean = true;

  constructor(
    private eventFormDataService: EventFormDataService
  ) { }

  finalizeEventCreation() {
    if (this.maxParticipantsEnabled) {
      this.eventFormDataService.setData("maxParticipants", this.maxParticipants);
      this.eventFormDataService.setData("maxParticipantsEnabled", true);
    } else {
      this.eventFormDataService.setData("maxParticipants", 0);
      this.eventFormDataService.setData("maxParticipantsEnabled", false);
    }

    console.log(this.eventFormDataService.getData());
  }
}
