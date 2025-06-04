import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
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
import {ChangePasswordButtonComponent} from "../../components/change-password-button/change-password-button.component";
import {LogoutButtonComponent} from "../../components/logout-button/logout-button.component";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, ProfileImageComponent, EditProfileInputComponent, ChangePasswordButtonComponent, LogoutButtonComponent]
})
export class EditProfilePage implements OnDestroy {
  userId: string | null = null;
  profileImage: string | File | null = null;
  imagePreviewUrl: string = 'assets/images/default_profile_image.png';
  email!: string;
  name!: string;
  surname!: string;
  username!: string;

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef
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

    if (typeof this.profileImage === 'string') {
      this.imagePreviewUrl = this.profileImage;
    } else {
      this.imagePreviewUrl = 'assets/images/default_profile_image.png';
    }

    this.email = profileData.email;
    this.name = profileData.name;
    this.surname = profileData.surname;
    this.username = profileData.username;

    this.cdr.detectChanges();
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

    await this.supabaseService.updateProfile(this.userId, {
      username: this.username,
      name: this.name,
      surname: this.surname,
      profile_image: this.profileImage
    });

    this.router.navigate(['/my-profile']);
    console.log('Profile updated successfully');
  }

  onImageChange(file: File) {
    this.profileImage = file;

    if (this.imagePreviewUrl && this.imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  ngOnDestroy() {
    if (this.imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }
}
