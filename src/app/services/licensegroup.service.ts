import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetLicenseGroupList,
  LicenseGroupViewModel,
} from 'src/app/models/shop/licenses';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  GetListResponse,
} from 'src/app/models/shared-models';
import { AuthService } from './auth.service';

@Injectable()
export class AppLicenseGroupService {
  api = CONSTANST.routes.licensegroup;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}
  private GetUrl() {
    let url: string;
    if (this.auth.isModerator() || this.auth.isStaff()) {
      url = this.api.moderator;
    } else if(this.auth.isSeller()) {
      url = this.api.seller;
    }
    else{
      throw new TypeError("User unknown");
    }

    return url;
  }

  get = (id: number) =>
    this.http.get<TResponseWrapper<LicenseGroupViewModel>>(`${this.GetUrl()}/${id}`);

  list = (options: GetLicenseGroupList | null) => {
    let httpParams = new HttpParams();

    if (options != null) {
      Object.keys(options).forEach(function (key) {
        httpParams = httpParams.append(
          key,
          JSON.stringify(options[key as keyof GetLicenseGroupList])
        );
      });
    }

    return this.http.get<GetListResponse<LicenseGroupViewModel>>(this.GetUrl(), {
      params: httpParams,
    });
  };
}
