import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, Validators} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LogoComponent} from "../../components/logo/logo.component";
import {SignupInputComponent} from "../../components/signup-input/signup-input.component";
import {AuthButtonComponent} from "../../components/auth-button/auth-button.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LogoComponent, SignupInputComponent, AuthButtonComponent]
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

  constructor() { }

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

  onSubmit() {

  }
}
