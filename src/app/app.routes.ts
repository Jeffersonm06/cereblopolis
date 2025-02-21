import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'init',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'init',
    loadComponent: () => import('./initials/initials.page').then( m => m.InitialsPage)
  },
  {
    path: 'playing',
    loadComponent: () => import('./playing/playing.page').then( m => m.PlayingPage)
  },
  {
    path: 'loading',
    loadComponent: () => import('./loading/loading.page').then( m => m.LoadingPage)
  },
];
