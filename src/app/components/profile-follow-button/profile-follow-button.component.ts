import { Component, OnInit } from '@angular/core';
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile-follow-button',
  templateUrl: './profile-follow-button.component.html',
  styleUrls: ['./profile-follow-button.component.scss'],
  imports: [
    IonButton
  ]
})
export class ProfileFollowButtonComponent  implements OnInit {
  followFlag: string = "Follow";
  isFollowing: boolean = false;

  constructor() { }

  ngOnInit() {}

  toggleFollow(): void {
    this.isFollowing = !this.isFollowing;
    this.followFlag = this.isFollowing ? "Following" : "Follow";
  }
}
