import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-first-test',
  templateUrl: './first-test.page.html',
  styleUrls: ['./first-test.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FirstTestPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('FirstTestPage initialized');
  }

}
