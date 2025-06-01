import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {HeaderComponent} from "../../components/header/header.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";
import {EditProfileInputComponent} from "../../components/edit-profile-input/edit-profile-input.component";
import {SupabaseService} from "../../services/supabase.service";
import {AlertController} from "@ionic/angular";
import {showAlert} from "../../services/utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, ProfileImageComponent, EditProfileInputComponent]
})
export class EditProfilePage {
  userId: string | null = null;
  profileImage: string | null = null;
  email!: string;
  name!: string;
  surname!: string;
  username!: string;

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.userId = await this.supabaseService.getUserId();
    if (!this.userId){
      console.error('No authenticated user found');
      return;
    }

    const profileData = await this.supabaseService.getEditProfileData(this.userId);
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

  async saveProfile() {
    if (!this.username || this.username.trim() === '') {
      console.error('Username is required');
      await showAlert(this.alertController, "Username is required", "Please enter a valid username.");
      return;
    }

    if (!this.userId) {
      console.error('No authenticated user found');
      return;
    }

    const updateResult = await this.supabaseService.updateProfile(this.userId, {
      username: this.username,
      name: this.name,
      surname: this.surname
    });

    if (updateResult.error) {
      console.error('Error updating profile:', updateResult.error);
    } else {
      this.router.navigate(['/my-profile']);
      console.log('Profile updated successfully');
    }
  }
}
