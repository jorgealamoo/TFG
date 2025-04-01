import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {HomeHeaderComponent} from "../../components/home-header/home-header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FooterComponent, HomeHeaderComponent]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
