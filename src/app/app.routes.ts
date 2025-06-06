import { Routes } from '@angular/router';
import {authGuard} from "./guards/auth.guard";

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
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'create-event',
    loadComponent: () => import('./pages/create-event/create-event.page').then( m => m.CreateEventPage),
    canActivate: [authGuard]
  },
  {
    path: 'create-event-shopping-list',
    loadComponent: () =>
      import('./pages/create-event-shopping-list/create-event-shopping-list.page')
        .then(m => m.CreateEventShoppingListPage)
  },
  {
    path: 'create-event-participants',
    loadComponent: () =>
      import('./pages/create-event-participants/create-event-participants.page')
      .then( m => m.CreateEventParticipantsPage),
    canActivate: [authGuard]
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./pages/event/event.page').then( m => m.EventPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-events',
    loadComponent: () => import('./pages/my-events/my-events.page').then( m => m.MyEventsPage),
    canActivate: [authGuard]
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage),
    canActivate: [authGuard]
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./pages/my-profile/my-profile.page').then( m => m.MyProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'profile/:userId',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then( m => m.EditProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'followers/:userId',
    loadComponent: () => import('./pages/followers/followers.page').then( m => m.FollowersPage),
    canActivate: [authGuard]
  },
  {
    path: 'following/:userId',
    loadComponent: () => import('./pages/following/following.page').then( m => m.FollowingPage),
    canActivate: [authGuard]
  }
];
