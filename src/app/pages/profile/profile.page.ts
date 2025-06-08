import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {EventPostComponent} from "../../components/event-post/event-post.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {ProfileCountersComponent} from "../../components/profile-counters/profile-counters.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";
import {ProfileFollowButtonComponent} from "../../components/profile-follow-button/profile-follow-button.component";
import {ActivatedRoute, Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, EventPostComponent, FooterComponent, ProfileCountersComponent, ProfileImageComponent, ProfileFollowButtonComponent]
})
export class ProfilePage implements OnInit {
  userId!: string;
  nameAndSurname: string ="Name Surname";
  username: string = "username";
  profileImage: string | null = null;
  createdEventsCount: number = 0;
  followersCount: number = 0;
  followingCount: number = 0;
  userEvents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const userId = params.get('userId');
      if (!userId) return;

      this.userId = userId;

      try {
        const currentUserId = await this.supabaseService.getUserId();
        if (currentUserId && currentUserId === userId) {
          this.router.navigate(['/my-profile']);
          return;
        }

        const profileData = await this.supabaseService.getUserProfileData(userId);
        if (profileData) {
          this.username = profileData.username;
          this.nameAndSurname = `${profileData.name} ${profileData.surname}`;
          this.profileImage = profileData.profile_image;
          this.followersCount = profileData.followersCount;
          this.followingCount = profileData.followingCount;
        } else {
          console.warn('User profile data not found for userId:', userId);
          this.router.navigate(['/home']);
        }

        this.userEvents = await this.supabaseService.getCreatedEventsByUserId(userId);
        this.createdEventsCount = this.userEvents.length;
      } catch (error) {
        console.error('Error loading profile data:', error);
        this.router.navigate(['/home']);
      }
    });
  }

  onFollowStatusChanged(status: 'followed' | 'unfollowed') {
    if (status === 'followed') {
      this.followersCount++;
    } else {
      this.followersCount = Math.max(0, this.followersCount - 1);
    }
  }

  async ionViewWillEnter() {
    this.reset();
  }

  reset() {
    this.userEvents = [];
    this.followersCount = 0;
    this.followingCount = 0;
    this.createdEventsCount = 0;
    this.profileImage = null;
  }

}
