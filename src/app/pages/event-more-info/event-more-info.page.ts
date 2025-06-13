import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonText} from '@ionic/angular/standalone';
import {EventHeaderComponent} from "../../components/event-header/event-header.component";
import {
  ShoppingListParticipantsSwitchComponent
} from "../../components/shopping-list-participants-switch/shopping-list-participants-switch.component";
import {ItemNameComponent} from "../../components/item-name/item-name.component";
import {ItemPriceComponent} from "../../components/item-price/item-price.component";
import {
  SplitCostsAutomaticallyComponent
} from "../../components/split-costs-automatically/split-costs-automatically.component";
import {TotalPriceComponent} from "../../components/total-price/total-price.component";
import {LeaveEventButtonComponent} from "../../components/leave-event-button/leave-event-button.component";
import {MaxParticipantsComponent} from "../../components/max-participants/max-participants.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SelectUserComponent} from "../../components/select-user/select-user.component";
import {ShareableLinkComponent} from "../../components/shareable-link/shareable-link.component";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-event-more-info',
  templateUrl: './event-more-info.page.html',
  styleUrls: ['./event-more-info.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, EventHeaderComponent, ShoppingListParticipantsSwitchComponent, ItemNameComponent, ItemPriceComponent, SplitCostsAutomaticallyComponent, TotalPriceComponent, LeaveEventButtonComponent, IonText, MaxParticipantsComponent, SearchBarComponent, SelectUserComponent, ShareableLinkComponent]
})
export class EventMoreInfoPage {
  eventId!: string;
  title: string = "Event Name";
  selectedView: string = 'shoppingList';
  userId: string | null = null;
  creatorId: string | null = null;

  shoppingListItems = [
    { name: '', price: 0 },
    { name: '', price: 0 },
    { name: '', price: 0 }
  ];
  totalPrice: number = 0;
  entryPrice: number = 0;
  splitCostsEnabled: boolean = true;
  creatorUsername: string = 'Username';

  maxParticipants: number = 20;
  maxParticipantsEnabled: boolean = true;
  participants!: { username: string; profile_image: string; id: string | null }[];
  participantsLength: number = 0;

  private autoSaveTimer: any;
  private lastSavedShoppingList: any[] = [];
  private lastSavedEntryPrice: number = 0;
  private lastSavedSplitCostsEnabled: boolean = true;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.userId = await this.supabaseService.getUserId();

    this.eventId = this.route.snapshot.paramMap.get('id')!;
    const details = await this.supabaseService.getEventMoreInfo(this.eventId);
    if (!details) return;
    this.creatorId = details.creatorUserId;

    this.title = details.title;
    this.shoppingListItems = details.shopping_list;
    this.totalPrice = details.total_price;
    this.entryPrice = details.entry_price;
    this.splitCostsEnabled = details.split_costs_enabled;
    this.creatorUsername = details.creatorUsername;
    this.lastSavedShoppingList = JSON.parse(JSON.stringify(this.shoppingListItems));

    this.maxParticipants = details.max_participants;
    this.maxParticipantsEnabled = details.max_participants_enabled;
    this.participants = details.participants || [];
    this.participantsLength = this.participants.length;
  }

  onViewChange(view: string) {
    this.selectedView = view;
  }

  updateTotalPrice() {
    const rawTotal = this.shoppingListItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    this.totalPrice = Math.round(rawTotal * 100) / 100;
    this.scheduleAutoSave();
  }

  addItem() {
    this.shoppingListItems.push({ name: '', price: 0 });
    this.updateTotalPrice();
    this.scheduleAutoSave();
  }

  removeItem(index: number) {
    this.shoppingListItems.splice(index, 1);
    this.updateTotalPrice();
    this.scheduleAutoSave();
  }

  onSplitCostsEnabledChange(value: boolean) {
    this.splitCostsEnabled = value;
    this.scheduleAutoSave();
  }

  onEntryPriceChange(value: number) {
    this.entryPrice = value;
    this.scheduleAutoSave();
  }

  calculateDue() {
    if (this.userId === this.creatorId) {
      return 0;
    } else if (this.splitCostsEnabled && this.participantsLength > 0) {
      const duePerPerson = this.totalPrice / this.participantsLength;
      return Math.round(duePerPerson * 100) / 100;
    } else if (!this.splitCostsEnabled) {
      return this.entryPrice;
    } else {
      return 0;
    }
  }

  scheduleAutoSave() {
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => {
      this.autoSaveShoppingList();
    }, 1500);
  }

  autoSaveShoppingList() {
    const hasListChanged = JSON.stringify(this.shoppingListItems) !== JSON.stringify(this.lastSavedShoppingList);
    const hasEntryPriceChanged = this.entryPrice !== this.lastSavedEntryPrice;
    const hasSplitCostsChanged = this.splitCostsEnabled !== this.lastSavedSplitCostsEnabled;

    const hasChanges = hasListChanged || hasEntryPriceChanged || hasSplitCostsChanged;

    if (!hasChanges) return;

    this.supabaseService.updateShoppingList(
      this.eventId,
      this.shoppingListItems,
      this.totalPrice,
      this.entryPrice,
      this.splitCostsEnabled
    ).then(({ error }) => {
        if (!error) {
          this.lastSavedShoppingList = JSON.parse(JSON.stringify(this.shoppingListItems));
          this.lastSavedEntryPrice = this.entryPrice;
          this.lastSavedSplitCostsEnabled = this.splitCostsEnabled;
          console.log('Auto-save successful');
        } else {
          console.error('Error in auto-save:', error.message);
        }
      });
  }

  addParticipant() {
    this.router.navigate(['/add-participants', this.eventId]);
  }
}
