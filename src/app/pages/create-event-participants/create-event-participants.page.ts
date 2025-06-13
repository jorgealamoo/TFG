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
  eventUuid: string = '';
  foundUsers: any[] = [];
  selectedUsers: any[] = [];
  userId: string | null = null;

  constructor(
    private eventFormDataService: EventFormDataService,
    private supabaseService: SupabaseService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const eventData = this.eventFormDataService.getData();
    if (!eventData.uuid) {
      this.router.navigate(['/create-event']);
    }
    this.eventUuid = eventData.uuid;
    this.userId = await this.supabaseService.getUserId();
    if (this.userId) {
      this.foundUsers = await this.supabaseService.getFollowingByUserId(this.userId);
    }
  }

  async finalizeEventCreation() {
    if (this.maxParticipantsEnabled) {
      this.eventFormDataService.setData("maxParticipants", this.maxParticipants);
      this.eventFormDataService.setData("maxParticipantsEnabled", true);
    } else {
      this.eventFormDataService.setData("maxParticipants", 0);
      this.eventFormDataService.setData("maxParticipantsEnabled", false);
    }

    const eventData = this.eventFormDataService.getData();
    this.supabaseService.createEvent(eventData)

    await this.supabaseService.sendEventInvitations(
      this.selectedUsers,
      eventData.uuid,
      eventData.title,
      this.userId
    )

    if (this.userId) await this.supabaseService.joinEvent(this.userId, eventData.uuid);

    this.router.navigate([`/create-event`]);
    console.log(this.eventFormDataService.getData());
  }

  async onSearch(searchText: string) {
    const results = await this.supabaseService.searchUsersByUsername(searchText);

    const selectedIds = new Set(this.selectedUsers.map(u => u.id));
    this.foundUsers = results.filter(user => !selectedIds.has(user.id));
  }

  onUserSelectionChange(event: { selected: boolean }, user: any) {
    if (event.selected) {
      if (!this.selectedUsers.find(u => u.id === user.id)) {
        this.selectedUsers.push(user);
        this.foundUsers = this.foundUsers.filter(u => u.id !== user.id);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);

      if (!this.foundUsers.find(u => u.id === user.id)) {
        this.foundUsers.push(user);
      }
    }
  }
}
