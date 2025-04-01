import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonIcon, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon
  ]
})
export class FooterComponent implements OnInit {

  selectedTab: string = 'home';

  tabs = [
    { name: 'my_events', defaultIcon: 'assets/images/my_event.png', selectedIcon: 'assets/images/my_event_selected.png' },
    { name: 'create', defaultIcon: 'assets/images/create.png', selectedIcon: 'assets/images/create_selected.png' },
    { name: 'home', defaultIcon: 'assets/images/home.png', selectedIcon: 'assets/images/home_selected.png' },
    { name: 'search', defaultIcon: 'assets/images/search.png', selectedIcon: 'assets/images/search_selected.png' },
    { name: 'profile', defaultIcon: 'assets/images/profile.png', selectedIcon: 'assets/images/profile_selected.png' },
  ];

  constructor() { }

  selectTab(tab: any) {
    this.selectedTab = tab.name;
  }

  ngOnInit() {}

}
