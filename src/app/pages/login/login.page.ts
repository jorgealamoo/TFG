import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LogoComponent} from "../../components/logo/logo.component";
import {LoginInputComponent} from "../../components/login-input/login-input.component";
import {AuthButtonComponent} from "../../components/auth-button/auth-button.component";

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

  constructor() { }

  ngOnInit() { }

  isEmailTouched() {
    return this.form.controls.email.touched;
  }

  isPasswordTouched() {
    return this.form.controls.password.touched;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Trying to log in with:', this.form.value);
      // Aquí podrías llamar a un servicio de autenticación
    }
  }
}
