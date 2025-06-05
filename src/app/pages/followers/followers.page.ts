import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {ActivatedRoute} from "@angular/router";
import {
  UserFollowerFollowingComponent
} from "../../components/user-follower-following/user-follower-following.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, UserFollowerFollowingComponent]
})
export class FollowersPage {
  private readonly userId: string;
  followers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }

  async ionViewWillEnter() {
    this.followers = await this.supabaseService.getFollowersByUserId(this.userId);
  }

}
