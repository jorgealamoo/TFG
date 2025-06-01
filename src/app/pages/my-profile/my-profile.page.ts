import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";
import {ProfileCountersComponent} from "../../components/profile-counters/profile-counters.component";
import {EventPostComponent} from "../../components/event-post/event-post.component";
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FooterComponent, ProfileImageComponent, ProfileCountersComponent, EventPostComponent, NgOptimizedImage]
})
export class MyProfilePage {
  nameAndSurname: string ="Name Surname";
  username: string = "username";
  profileImage: string | null = null;
  createdEventsCount: number = 0;
  followersCount: number = 0;
  followingCount: number = 0;
  userEvents: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    const userId = await this.supabaseService.getUserId();
    if (!userId){
      console.error('No authenticated user found');
      return;
    }

    const profileData = await this.supabaseService.getUserProfileData(userId);
    if (!profileData) {
      console.error('No profile data found');
      return;
    }

    this.username = profileData.username;
    this.nameAndSurname = `${profileData.name} ${profileData.surname}`;
    this.profileImage = profileData.profile_image;
    this.createdEventsCount = profileData.createdEventsCount;
    this.followersCount = profileData.followersCount;
    this.followingCount = profileData.followingCount;
    this.userEvents = await this.supabaseService.getCreatedEventsByUserId(userId);
  }

  openSettings() {
    this.router.navigate(['/edit-profile']);
  }
}
