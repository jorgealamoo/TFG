import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {NavigationEnd, Router} from "@angular/router";
import {FooterComponent} from "./components/footer/footer.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, FooterComponent, NgIf],
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  shouldShowFooter(): boolean {
    const pagesWithFooter = ["/home", "/create-event", "/my-events", "/search", "/profile"];
    return pagesWithFooter.includes(this.currentRoute);
  }
}
