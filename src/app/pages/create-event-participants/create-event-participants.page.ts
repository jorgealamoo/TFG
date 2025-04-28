import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonText} from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {MaxParticipantsComponent} from "../../components/max-participants/max-participants.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SelectUserComponent} from "../../components/select-user/select-user.component";
import {ShareableLinkComponent} from "../../components/shareable-link/shareable-link.component";
import {EventFormDataService} from "../../services/event-form-data.service";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-event-participants',
  templateUrl: './create-event-participants.page.html',
  styleUrls: ['./create-event-participants.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, MaxParticipantsComponent, IonText, SearchBarComponent, SelectUserComponent, ShareableLinkComponent]
})
export class CreateEventParticipantsPage implements OnInit {
  maxParticipants: number = 20;
  maxParticipantsEnabled: boolean = true;

  constructor(
    private eventFormDataService: EventFormDataService,
    private supabaseService: SupabaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    const eventData = this.eventFormDataService.getData();
    if (!eventData.uuid) {
      this.router.navigate(['/create-event']);
    }
  }

  finalizeEventCreation() {
    if (this.maxParticipantsEnabled) {
      this.eventFormDataService.setData("maxParticipants", this.maxParticipants);
      this.eventFormDataService.setData("maxParticipantsEnabled", true);
    } else {
      this.eventFormDataService.setData("maxParticipants", 0);
      this.eventFormDataService.setData("maxParticipantsEnabled", false);
    }

    this.supabaseService.createEvent(this.eventFormDataService.getData())
    console.log(this.eventFormDataService.getData());
  }
}
