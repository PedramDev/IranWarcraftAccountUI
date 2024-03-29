import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        this.authService.isLoggedIn.subscribe(v=>{
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${this.authService.getToken()}`
                  }
            });
        })

            

            // request = request.clone({
            //     setHeaders: {
            //         'Authorization': `Bearer ${this.authService.getToken()}`,
            //         'Content-Type': 'application/json',//=> باعث ایجاد خطا برا آپلود فایل میشه
            //         'Accept': 'application/json', 
            //       }
            // });

        return next.handle(request);
    }
}
