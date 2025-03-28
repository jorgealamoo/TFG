import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, Validators} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LogoComponent} from "../../components/logo/logo.component";
import {SignupInputComponent} from "../../components/signup-input/signup-input.component";
import {AuthButtonComponent} from "../../components/auth-button/auth-button.component";
import {SupabaseService} from "../../services/supabase.service";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {GoogleFacebookButtonComponent} from "../../components/google-facebook-button/google-facebook-button.component";
import {AuthRedirectButtonComponent} from "../../components/auth-redirect-button/auth-redirect-button.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LogoComponent, SignupInputComponent, AuthButtonComponent, GoogleFacebookButtonComponent, AuthRedirectButtonComponent]
})
export class SignupPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.validateSamePassword])
  });

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const repeatPassword = control.parent?.get('repeatPassword');
    return password?.value == repeatPassword?.value ? null : { notSame: true };
  }

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() { }

  isEmailTouched() {
    return this.form.controls.email.touched;
  }

  isUsernameTouched() {
    return this.form.controls.username.touched;
  }

  isPasswordTouched() {
    return this.form.controls.password.touched;
  }

  isRepeatPasswordTouched() {
    return this.form.controls.repeatPassword.touched;
  }

  async onSubmit() {
    if (this.form.valid) {
      const password = this.form.value.password ?? "";
      const repeatPassword = this.form.value.repeatPassword ?? "";

      if (password !== repeatPassword) {
        await this.showAlert('Error', 'Passwords do not match');
        return;
      }

      const credentials = {
        email: this.form.value.email ?? "",
        username: this.form.value.username ?? "",
        password: this.form.value.password ?? "",
        repeatPassword: this.form.value.repeatPassword ?? ""
      };

      this.supabaseService.signUp(credentials)
        .then((response) => {
          console.log("Signup successful", response);
          this.router.navigate(['/login']);
        })
        .catch(async (error) => {
          console.error("Signup failed", error);
          await this.showAlert('Signup Error', error.message || error);
        });
    } else {
      console.log("Form is invalid");
      await this.showAlert('Invalid Form', 'Please fill all required fields.');
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
    console.log(`Sign Up with ${provider}`);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
