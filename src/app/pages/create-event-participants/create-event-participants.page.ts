import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonText} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {MaxParticipantsComponent} from "../../components/max-participants/max-participants.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SelectUserComponent} from "../../components/select-user/select-user.component";
import {ShareableLinkComponent} from "../../components/shareable-link/shareable-link.component";

@Component({
  selector: 'app-create-event-participants',
  templateUrl: './create-event-participants.page.html',
  styleUrls: ['./create-event-participants.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, MaxParticipantsComponent, IonText, SearchBarComponent, SelectUserComponent, ShareableLinkComponent]
})
export class CreateEventParticipantsPage {

  constructor() { }

}
