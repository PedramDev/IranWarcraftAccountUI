import {Injectable} from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    this.auth.isLoggedIn.subscribe(value=>{
      if (value) {
        // logged in so return true
        return true;
      }
      else{
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    });
    return true;
  }
}
