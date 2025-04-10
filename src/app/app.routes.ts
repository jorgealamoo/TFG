import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "", loadComponent: () => import("./pages/login/login.page")
      .then(m => m.LoginPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'create-event',
    loadComponent: () => import('./pages/create-event/create-event.page').then( m => m.CreateEventPage)
  },
  {
    path: 'create-event-shopping-list',
    loadComponent: () =>
      import('./pages/create-event-shopping-list/create-event-shopping-list.page')
        .then(m => m.CreateEventShoppingListPage)
  }
];
