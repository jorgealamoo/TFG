import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {ProfileImageComponent} from "../../components/profile-image/profile-image.component";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterComponent, ProfileImageComponent]
})
export class MyProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
