import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { AppLayoutsModule } from './layouts/layouts.module';
import { NZ_I18N ,fa_IR, NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import fa from '@angular/common/locales/fa';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {services
} from 'src/app/services';
import { faIR } from 'date-fns/locale';
import { JwtInterceptor } from './interceptors/JwtInterceptor';
import { ErrorInterceptor } from './interceptors/ErrorInterceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { PipesModule  } from './pipes/pipes.module';

// import { AdminGuard } from '~app/guards/admin.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ShareModule } from './share.module';
// import { CustomerGuard } from '~app/guards/customer.guard';

registerLocaleData(fa);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    AppLayoutsModule,
    FormsModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    ShareModule,
    PipesModule,
    ServiceWorkerModule.register("ngsw-worker.js",{ enabled: environment.production ,
    // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      // registerWhenStable:30000
      registrationStrategy: 'registerImmediately'})
  ],
  providers: [
    { provide: NZ_DATE_LOCALE, useValue: faIR },
    { provide: NZ_I18N, useValue: fa_IR },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    ...services,

    AuthGuard
  ],
})
export class AppModule {}
