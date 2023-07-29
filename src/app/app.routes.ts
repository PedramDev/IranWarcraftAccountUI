import { Routes } from '@angular/router';
import { AppLayoutMainComponent } from './layouts/layout-main/layout-main.component';
import { CPanelROUTES } from 'src/app/pages/cpanel/cpanelRoutes';
import { AuthGuard } from './guards/auth.guard';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/signin/signin.module').then((m) => m.AppSigninModule),
  },
  {
    path: 'cpanel',
    canActivate: [AuthGuard],
    component: AppLayoutMainComponent,
    children: CPanelROUTES,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
