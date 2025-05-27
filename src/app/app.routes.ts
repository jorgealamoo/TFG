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
  },
  {
    path: 'create-event-participants',
    loadComponent: () => import('./pages/create-event-participants/create-event-participants.page').then( m => m.CreateEventParticipantsPage)
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage)
  },
  {
    path: 'my-events',
    loadComponent: () => import('./pages/my-events/my-events.page').then( m => m.MyEventsPage)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./pages/my-profile/my-profile.page').then( m => m.MyProfilePage)
  },
  {
    path: 'profile/:userId',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  }
];
