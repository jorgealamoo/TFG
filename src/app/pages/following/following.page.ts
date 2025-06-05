import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {
  UserFollowerFollowingComponent
} from "../../components/user-follower-following/user-follower-following.component";
import {ActivatedRoute} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, UserFollowerFollowingComponent]
})
export class FollowingPage {
  private readonly userId: string;
  followings: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }

  async ionViewWillEnter() {
    this.followings = await this.supabaseService.getFollowingByUserId(this.userId);
  }
}
