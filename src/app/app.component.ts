import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Policy, UserRole } from './models/auth';
import { AuthService } from './services/auth.service';
import { DataSharingService } from './services/data-sharing.service';
import { AppUserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isUserLoggedIn: boolean;
  fullName = '';
  isCollapsed = false;
  offline: boolean;
  profileVisible = false;

  isModerator :false;
  isStaff:false;
  isSeller:false;
  
  constructor(
    private dataSharing : DataSharingService,
    private swUpdate: SwUpdate,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService : AppUserService,sharing :DataSharingService) {
      authService.isLoggedIn.subscribe(value=>{
        this.isUserLoggedIn = value;
      });

      sharing.currentUser.subscribe(value=>{
      });

      
  }
  ngOnInit(): void {

    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

          if(confirm("New version available. Load New Version?")) {

              window.location.reload();
          }
      });
    }

    this.authService.isLoggedIn.subscribe(value=>{
      if (value) {
        this.updateDataSharing();
      }
    });
  

    // window.addEventListener('online',  this.onNetworkStatusChange.bind(this));
    // window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
  }

  hasPolicy(policy : string){
    return this.authService.hasPolicy(policy);
  }

  updateDataSharing(){
    this.userService.me().subscribe({
      next: (v) => {
        this.dataSharing.currentUser.next(v.data);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }


  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
    console.log('offline ' + this.offline);
  }

  logout(){
    this.authService.destroy();
    this.router.navigate(['/login'], { skipLocationChange: false});
    location.reload()
  }

  
}
