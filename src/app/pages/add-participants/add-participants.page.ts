import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SelectUserComponent} from "../../components/select-user/select-user.component";
import {ActivatedRoute} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-add-participants',
  templateUrl: './add-participants.page.html',
  styleUrls: ['./add-participants.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, SearchBarComponent, SelectUserComponent]
})
export class AddParticipantsPage {
  foundUsers: any[] = [];
  selectedUsers: any[] = [];
  participants: any[] = [];
  eventId: string = '';
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) { }

  async ionViewWillEnter() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.userId = await this.supabaseService.getUserId();

    const details = await this.supabaseService.getEventMoreInfo(this.eventId);
    if (details) {
      this.participants = details.participants || [];
    }

    if (this.userId) {
      const allUsers = await this.supabaseService.getFollowingByUserId(this.userId);
      const selectedIds = new Set(this.participants.map(u => u.id));
      this.foundUsers = allUsers.filter(user => !selectedIds.has(user.id));
    }
  }

  async finalizeAddParticipants() {
    const title = await this.supabaseService.getEventTitleById(this.eventId);
    if (title) {
      await this.supabaseService.sendEventInvitations(
        this.selectedUsers,
        this.eventId,
        title,
        this.userId
      )
    }

    window.history.back();
  }

  private getExcludedIds(): Set<string> {
    return new Set([
      ...this.selectedUsers.map(u => u.id),
      ...this.participants.map(u => u.id),
    ]);
  }

  async onSearch(searchText: string) {
    const results = await this.supabaseService.searchUsersByUsername(searchText);

    const excluded = this.getExcludedIds();
    this.foundUsers = results.filter(user => !excluded.has(user.id));
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
