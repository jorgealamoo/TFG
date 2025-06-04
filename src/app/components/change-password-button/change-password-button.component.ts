import { Component } from '@angular/core';
import {IonButton, IonInput, IonItem} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {showAlert} from "../../services/utils";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-change-password-button',
  templateUrl: './change-password-button.component.html',
  styleUrls: ['./change-password-button.component.scss'],
  imports: [
    IonButton,
    NgIf,
    IonItem,
    IonInput,
    FormsModule
  ]
})
export class ChangePasswordButtonComponent{
  showChangePasswordForm: boolean = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) { }

  changePassword() {
    this.showChangePasswordForm = true;
  }

  closePopup() {
    this.showChangePasswordForm = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  async submitPasswordChange() {
    if (this.newPassword !== this.confirmPassword) {
      await showAlert(this.alertController, "Invalid Passwords", "Passwords do not match.")
      return;
    }

    if (this.newPassword.length < 6) {
      await showAlert(this.alertController, "Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    const isValidPassword = await this.supabaseService.verifyCurrentPassword(this.currentPassword);

    if (!isValidPassword) {
      await showAlert(this.alertController, "Incorrect Password", "The current password is incorrect.");
      return;
    }

    await this.supabaseService.changePassword(this.newPassword);

    console.log('Password changed.');
    this.closePopup();
  }
}
