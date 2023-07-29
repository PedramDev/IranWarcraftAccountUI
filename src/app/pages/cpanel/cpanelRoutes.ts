import { Routes } from '@angular/router';

export const CPanelROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/pages/cpanel/cpanel.module').then(
        (module) => module.AppCpanelDashboardModule
      ),
  },
];
