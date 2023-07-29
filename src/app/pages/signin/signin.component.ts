import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppToasterService } from 'src/app/services/toaster.service';
import { AppUserService } from 'src/app/services/user.service';
import * as model from 'src/app/models/auth';
import { MessageType } from 'src/app/services/MessageType';
import { MSG } from 'src/app/utils/messages';
import { ShowForms } from './ShowForms';


import { FormsModule } from '@angular/forms'; ///required
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls:['./signin.scss']
})
export class AppSigninComponent implements OnInit {
  public preLoginCheck: model.PreLoginCheck;
  public loginByMobileOtp : model.LoginByMobileOtp;
  public registerUserByMobile : model.RegisterUserByMobile;

  checkUserExistSubmitted = false;
  registerSubmitted = false;
  signInSubmitted = false;

  WichForm = ShowForms.PreCheck;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toaster: AppToasterService,
    private readonly userService: AppUserService,
    private readonly authService: AuthService
  ) {
    this.authService.isLoggedIn.subscribe(v=>{
      this.router.navigate(['/cpanel'], { relativeTo: this.route });
    })
  }
  ngOnInit(): void {
    this.preLoginCheck = new model.PreLoginCheck();
    this.loginByMobileOtp = new model.LoginByMobileOtp();
    this.registerUserByMobile = new model.RegisterUserByMobile();
  }

  changePhone() {
    this.WichForm =ShowForms.PreCheck;
    this.pauseTimer();
    //timer => 0
    this.setMobile('');
  }

  setMobile(mobile:string){
    this.registerUserByMobile.mobile = mobile;
    this.loginByMobileOtp.mobile = mobile;
    this.preLoginCheck.mobile = mobile;
  }

  checkUserExist() {
    this.checkUserExistSubmitted = true;
    this.authService.preLoginCheck(this.preLoginCheck).subscribe({
      next: (v) => {
        this.checkUserExistSubmitted = false;
        this.pauseTimer();
        this.startTimer();

        this.setMobile(this.preLoginCheck.mobile);

        if (v.data) {
            this.WichForm = ShowForms.Login;
        } else {
            this.WichForm = ShowForms.Register;
        }
      },
      error: (e:HttpErrorResponse) => {
        this.checkUserExistSubmitted = false;
        console.error(e.message);
        this.toaster.toast(MessageType.error, e.error);
      },
    });
  }

  register() {
    this.registerSubmitted = true;
    this.authService.registerWithMobile(this.registerUserByMobile).subscribe({
      next: (v) => {
        this.authService.setLogin(v.data);
        this.authService.loggedIn.next(true);
        this.registerSubmitted = false;
        this.toaster.toast(MessageType.success, MSG.sign.register.success);

        this.onReloadPage();


      },
      error: (e:HttpErrorResponse) => {
        this.registerSubmitted = false;
        console.error(e.message);
        this.toaster.toast(MessageType.error, e.error);
      },
    });
  }

  signIn() {
    this.signInSubmitted = true;
    this.authService.loginWithMobile(this.loginByMobileOtp).subscribe({
      next: (v) => {
        this.authService.setLogin(v.data);
        this.authService.loggedIn.next(true);
        this.signInSubmitted = false;
        this.toaster.toast(MessageType.success, MSG.sign.login.success);
        this.pauseTimer();

        this.onReloadPage();

      },
      error: (e:HttpErrorResponse) => {
        this.signInSubmitted = false;
        console.error(e.message);
        this.toaster.toast(MessageType.error, e.error);
      },
    });
  }

  onReloadPage() {
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/cpanel'], { relativeTo: this.route, queryParamsHandling: 'preserve' } );
  }

  timeLeft = 300;
  interval:NodeJS.Timeout;
  sendRound=1;
  sendCode1='ارسال رمز یکبار مصرف';
  sendCode2='ارسال مجدد';

  sendCodeText=this.sendCode1;
  pauseTimer() {
    this.timeLeft = 0;
    clearInterval(this.interval);
  } 
  startTimer() {
    this.timeLeft = 180;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
      else {
        this.timerTimeOut();
        this.pauseTimer();
      }
    }, 1000);
  }
  timerTimeOut(){
    if(this.sendRound<=1){
      this.sendRound++;
      this.sendCodeText = this.sendCode2;
    }
    else{
      this.sendRound=1;
      this.toaster.warning('لطفا از صحت شماره تلفن خود اطمینان حاصل کنید');
    }
  }

}
