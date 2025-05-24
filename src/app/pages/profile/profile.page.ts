import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {EventPostComponent} from "../../components/event-post/event-post.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {ProfileCountersComponent} from "../../components/profile-counters/profile-counters.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";
import {ProfileFollowButtonComponent} from "../../components/profile-follow-button/profile-follow-button.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, EventPostComponent, FooterComponent, ProfileCountersComponent, ProfileImageComponent, ProfileFollowButtonComponent]
})
export class ProfilePage implements OnInit {
  nameAndSurname: string ="Name Surname";
  username: string = "username";
  profileImage: string | null = null;
  createdEventsCount: number = 0;
  followersCount: number = 0;
  followingCount: number = 0;
  userEvents: any[] = [];

  constructor() { }

  ngOnInit() {

  }

}
