import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LogoComponent} from "../../components/logo/logo.component";
import {LoginInputComponent} from "../../components/login-input/login-input.component";
import {AuthButtonComponent} from "../../components/auth-button/auth-button.component";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LogoComponent, LoginInputComponent, ReactiveFormsModule, AuthButtonComponent]
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() { }

  isEmailTouched() {
    return this.form.controls.email.touched;
  }

  isPasswordTouched() {
    return this.form.controls.password.touched;
  }

  onSubmit() {
    console.log('Trying to log in with:', this.form.value);
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.email ?? "",
        password: this.form.value.password ?? ""
      };

      this.supabaseService.signIn(credentials)
        .then(response => {
          console.log('Login successful:', response);
        })
        .catch(error => {
          console.error('Login failed:', error);
        });
    } else {
      console.log("Form is invalid");
    }
  }
}
