import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-google-facebook-button',
  templateUrl: './google-facebook-button.component.html',
  styleUrls: ['./google-facebook-button.component.scss'],
  imports: [
    IonButton,
    NgClass
  ]
})
export class GoogleFacebookButtonComponent  implements OnInit {
  @Input() provider: 'google' | 'facebook' = 'google';
  @Output() action = new EventEmitter<string>();

  getButtonLabel(): string {
    return this.provider === 'google' ? 'Google' : 'Facebook';
  }

  onClick() {
    this.action.emit(this.provider);
  }

  constructor() { }

  ngOnInit() {}

}
