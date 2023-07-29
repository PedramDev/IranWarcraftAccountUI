import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppCpanelDashboardComponent } from 'src/app/pages/cpanel/cpanel.component';

const ROUTES: Routes = [
  {
    path: '',
    component: AppCpanelDashboardComponent,
  },
  {
    path: 'region',
    loadChildren: () =>
      import('src/app/pages/cpanel/region/index.module').then(
        (module) => module.AppRegionModule
      ),
  },

  {
    path: 'product',
    loadChildren: () =>
      import('src/app/pages/cpanel/product/index.module').then(
        (module) => module.AppProductModule
      ),
  },

  {
    path: 'product-category',
    loadChildren: () =>
      import('src/app/pages/cpanel/product-category/index.module').then(
        (module) => module.AppProductCategoryModule
      ),
  },

  {
    path: 'tag',
    loadChildren: () =>
      import('src/app/pages/cpanel/tag/index.module').then(
        (module) => module.AppTagModule
      ),
  },

  {
    path: 'article',
    loadChildren: () =>
      import('src/app/pages/cpanel/article/index.module').then(
        (module) => module.AppArticleModule
      ),
  },

  {
    path: 'article-comment',
    loadChildren: () =>
      import('src/app/pages/cpanel/comment/index.module').then(
        (module) => module.AppCommentModule
      ),
  },

  {
    path: 'article-category',
    loadChildren: () =>
      import('src/app/pages/cpanel/article-category/index.module').then(
        (module) => module.AppArticleCategoryModule
      ),
  },

  {
    path: 'ticket',
    loadChildren: () =>
      import('src/app/pages/cpanel/ticket/index.module').then(
        (module) => module.AppTicketModule
      ),
  },

  {
    path: 'bank-account',
    loadChildren: () =>
      import('src/app/pages/cpanel/bank-account/index.module').then(
        (module) => module.AppBankAccountModule
      ),
  },


  

  {
    path: 'contact-message',
    loadChildren: () =>
      import('src/app/pages/cpanel/contact-message/index.module').then(
        (module) => module.AppContactMessageModule
      ),
  },

  {
    path: 'additional-page',
    loadChildren: () =>
      import('src/app/pages/cpanel/additional-page/index.module').then(
        (module) => module.AppAdditionalPageModule
      ),
  },

  {
    path: 'system-setting',
    loadChildren: () =>
      import('src/app/pages/cpanel/system-setting/index.module').then(
        (module) => module.AppSystemSettingModule
      ),
  },

  

  {
    path: 'license',
    loadChildren: () =>
      import('src/app/pages/cpanel/license/index.module').then(
        (module) => module.AppLicenseModule
      ),
  },
];

@NgModule({
  declarations: [AppCpanelDashboardComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(ROUTES)],
  exports: [],
})
export class AppCpanelDashboardModule {}
