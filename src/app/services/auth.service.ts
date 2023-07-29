import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as model from 'src/app/models/auth';
import { CONSTANST } from '../utils/constanst';
import { ResponseWrapper, TResponseWrapper } from '../models/shared-models';
import { UserViewModel } from '../models/user';

@Injectable()
export class AuthService {
  api = CONSTANST.routes.auth;

  public loggedIn = new BehaviorSubject<boolean>(this.isLogin());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(public http: HttpClient) {}

  private isLogin() {
    if (this.getRole() == null || this.getToken() == null || this.isExpired()) {
      console.log(false);
      return false;
    }
    console.log(true);
    return true;
  }

  //#region  fakes

  createFake = () =>
    this.http.post(`${CONSTANST.routes.secret + '/create-fake-users'}`, {});
  fakeUser = (data: string) =>
    this.http.post<TResponseWrapper<model.AuthenticateViewModel>>(
      `${this.api + '/fake-user'}`,
      { Role: data }
    );

  registerWithMobile = (data: model.RegisterUserByMobile) => {
    return this.http.post<TResponseWrapper<model.AuthenticateViewModel>>(
      `${this.api + '/register'}`,
      data
    );
  };

  loginWithMobile = (data: model.LoginByMobileOtp) => {
    return this.http.post<TResponseWrapper<model.AuthenticateViewModel>>(
      `${this.api + '/login'}`,
      data
    );
  };

  verifyMobileOtp = (data: model.VerifyMobileOtp) => {
    return this.http.post<ResponseWrapper>(
      `${this.api + '/verify-mobile-otp'}`,
      data
    );
  };

  preLoginCheck = (data: model.PreLoginCheck) => {
    return this.http.post<TResponseWrapper<boolean>>(
      `${this.api + '/is-exist'}`,
      data
    );
  };

  setLogin(data: model.AuthenticateViewModel): void {
    this.setToken(data.token);
    this.setRole(data.role);
    this.setId(data.id);
    this.setExpire(data.expiredIn);
  }

  isExpired(): boolean {
    const now = Date.now();
    const exp = this.getExpire();
    if (now > exp) {
      return true;
    } else {
      return false;
    }
  }
  getExpire(): number | null {
    const exp = localStorage.getItem('ExpireIn');
    if (exp != null || exp !== undefined) {
      return Number(exp);
    } else {
      return null;
    }
  }
  setExpire(exp: number): void {
    const t = new Date();
    const localExp = t.setSeconds(t.getSeconds() + exp);
    localStorage.setItem('ExpireIn', localExp.toString());
  }

  setFullName(str: string): void {
    localStorage.setItem('FullName', str);
  }
  getFullName(): string {
    return localStorage.getItem('FullName');
  }
  setToken(token: string): void {
    localStorage.setItem('Token', token);
  }
  setRole(role: model.UserRole): void {
    localStorage.setItem('Role', role.toString());
  }
  getToken(): string {
    return localStorage.getItem('Token');
  }

  getRole(): string {
    return localStorage.getItem('Role');
  }

  setId(id: number): void {
    localStorage.setItem('Id', id.toString());
  }
  getId(): number | null {
    const id = localStorage.getItem('Id');
    if (id === undefined || id == null) {
      return null;
    } else {
      return Number(id);
    }
  }

  destroy(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('Role');
    localStorage.removeItem('Id');
    localStorage.removeItem('ExpireIn');

    localStorage.removeItem('user_emailAddress');
    localStorage.removeItem('user_firstName');
    localStorage.removeItem('user_lastName');
    localStorage.removeItem('user_name');
  }

  isStaff(): boolean {
    if (this.getRole() == model.UserRole.Staff) {
      return true;
    }
    return false;
  }

  isModerator(): boolean {
    if (this.getRole() == model.UserRole.Moderator) {
      return true;
    }
    return false;
  }

  isSeller(): boolean {
    if (this.getRole() == model.UserRole.Seller) {
      return true;
    }
    return false;
  }

  isBuyer(): boolean {
    if (this.getRole() == model.UserRole.Buyer) {
      return true;
    }
    return false;
  }

  isCustomer(): boolean {
    if (this.isBuyer() || this.isSeller()) {
      return true;
    }
    return false;
  }

  getUserMeta(): UserViewModel {
    let user = new UserViewModel();
    user.emailAddress = localStorage.getItem('user_emailAddress');
    user.firstName = localStorage.getItem('user_firstName');
    user.lastName = localStorage.getItem('user_lastName');
    user.name = localStorage.getItem('user_name');

    return user;
  }

  setUserMeta(user: UserViewModel) {
    localStorage.setItem('user_emailAddress', user.emailAddress);
    localStorage.setItem('user_firstName', user.firstName);
    localStorage.setItem('user_lastName', user.lastName);
    localStorage.setItem('user_name', user.name);
  }

  isMetaSet() {
    if (
      localStorage.getItem('user_emailAddress') &&
      localStorage.getItem('user_firstName') &&
      localStorage.getItem('user_lastName') &&
      localStorage.getItem('user_name')
    ) {
      return true;
    } else {
      return false;
    }
  }

  hasPolicy(policyStr: string) {
    let splited = this.getRole().split('');
    splited[0] = splited[0].toUpperCase();
    const roleStr = splited.join('');

    const policy = model.Policy[policyStr as keyof typeof model.Policy];
    const role = model.UserRole[roleStr as keyof typeof model.UserRole];

    switch (policy) {
      case model.Policy.Moderator:
        if(role == model.UserRole.Moderator){
          return true;
        }
        break;

      case model.Policy.ModeratorOrStaff:
        if(role == model.UserRole.Moderator || role == model.UserRole.Staff){
          return true;
        }
        break;

      case model.Policy.ModeratorOrSeller:
        if(role == model.UserRole.Moderator || role == model.UserRole.Staff || role == model.UserRole.Seller){
          return true;
        }
        break;

      case model.Policy.ModeratorOrCustomer:
        if(role == model.UserRole.Moderator || role == model.UserRole.Staff || role == model.UserRole.Seller || role == model.UserRole.Buyer){
          return true;
        }
        break;

      case model.Policy.Seller:
        if(role == model.UserRole.Seller){
          return true;
        }
        break;

      case model.Policy.SellerOrCustomer:
        if(role == model.UserRole.Seller || role == model.UserRole.Buyer){
          return true;
        }
        break;

      case model.Policy.ModeratorOrSeller:
        if(role == model.UserRole.Seller || role == model.UserRole.Moderator){
          return true;
        }
        break;
    }

    return false;
  }
}
