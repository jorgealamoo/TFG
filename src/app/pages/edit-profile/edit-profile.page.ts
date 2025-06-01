import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";
import {EditProfileInputComponent} from "../../components/edit-profile-input/edit-profile-input.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, ProfileImageComponent, EditProfileInputComponent]
})
export class EditProfilePage {
  profileImage: string | null = null;
  email!: string;
  name!: string;
  surname!: string;
  username!: string;

  constructor(private supabaseService: SupabaseService) { }

  async ionViewWillEnter() {
    const userId = await this.supabaseService.getUserId();
    if (!userId){
      console.error('No authenticated user found');
      return;
    }

    const profileData = await this.supabaseService.getEditProfileData(userId);
    if (!profileData) {
      console.error('No profile data found');
      return;
    }

    this.profileImage = profileData.profile_image;
    this.email = profileData.email;
    this.name = profileData.name;
    this.surname = profileData.surname;
    this.username = profileData.username;
  }

}
