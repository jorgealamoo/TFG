import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LogoComponent} from "../../components/logo/logo.component";
import {LoginInputComponent} from "../../components/login-input/login-input.component";
import {AuthButtonComponent} from "../../components/auth-button/auth-button.component";
import {SupabaseService} from "../../services/supabase.service";
import {GoogleFacebookButtonComponent} from "../../components/google-facebook-button/google-facebook-button.component";
import {AuthRedirectButtonComponent} from "../../components/auth-redirect-button/auth-redirect-button.component";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LogoComponent, LoginInputComponent, ReactiveFormsModule, AuthButtonComponent, GoogleFacebookButtonComponent, AuthRedirectButtonComponent]
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() { }

  isEmailTouched() {
    return this.form.controls.email.touched;
  }

  isPasswordTouched() {
    return this.form.controls.password.touched;
  }

  async onSubmit() {
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email ?? "",
        password: this.form.value.password ?? ""
      };

      this.supabaseService.signIn(credentials)
        .then(response => {
          console.log('Login successful:', response);
          this.router.navigate(['/home']);
        })
        .catch(async error => {
          await this.showAlert("Email or password is incorrect", "Please check your email and password and try again.");
        });
    } else {
      console.log("Form is invalid");
      await this.showAlert("Invalid form", "Please check your email and password.");
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  onSocialLogin(provider: string) {
    console.log(`Login with ${provider}`);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
