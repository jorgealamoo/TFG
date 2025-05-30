import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FooterComponent, HeaderComponent]
})
export class MyEventsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
