import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: 'app-auth-redirect-button',
  templateUrl: './auth-redirect-button.component.html',
  styleUrls: ['./auth-redirect-button.component.scss'],
  imports: [
    IonButton
  ]
})
export class AuthRedirectButtonComponent  implements OnInit {

  @Input() redirectTo: 'login' | 'signup' = 'login';

  constructor(private router: Router) { }

  onClick() {
    if (this.redirectTo === 'signup') {
      this.router.navigate(['/signup']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

}
