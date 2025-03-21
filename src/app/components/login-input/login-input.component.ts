import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonItem} from "@ionic/angular/standalone";

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.scss'],
  imports: [
    IonItem,
    IonInput,
    ReactiveFormsModule
  ]
})
export class LoginInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() placeholder: string = "Text";
  @Input() name: string = "";

  constructor() { }

  ngOnInit() {}

}
