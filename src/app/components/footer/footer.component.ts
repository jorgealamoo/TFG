import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton
  ]
})
export class FooterComponent {
  currentRoute: string = '';
  selectedTab: string = 'home';

  tabs = [
    { name: 'my_events', route: '/my-events', defaultIcon: 'assets/images/my_event.png', selectedIcon: 'assets/images/my_event_selected.png' },
    { name: 'create', route: '/create-event', defaultIcon: 'assets/images/create.png', selectedIcon: 'assets/images/create_selected.png' },
    { name: 'home', route: '/home', defaultIcon: 'assets/images/home.png', selectedIcon: 'assets/images/home_selected.png' },
    { name: 'search', route: '/search', defaultIcon: 'assets/images/search.png', selectedIcon: 'assets/images/search_selected.png' },
    { name: 'profile', route: '/my-profile', defaultIcon: 'assets/images/profile.png', selectedIcon: 'assets/images/profile_selected.png' },
  ];

  constructor(private router: Router) {
    this.currentRoute = this.router.url;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  selectTab(tab: any) {
    this.router.navigate([tab.route]);
  }

}
