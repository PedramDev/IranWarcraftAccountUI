import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddLicenseListBySellerResponse,
  AddLicenseListBySeller,
  GetLicenseList,
  LicenseViewModel,
  PatchLicense,
} from 'src/app/models/shop/licenses';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
} from 'src/app/models/shared-models';
import { AuthService } from './auth.service';

@Injectable()
export class AppLicenseService {
  api = CONSTANST.routes.licenses;

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

  add = (data: AddLicenseListBySeller) =>
    this.http.post<GetListResponse<AddLicenseListBySellerResponse>>(
        this.GetUrl(),
      data
    );

  delete = (id: number[]) => {
    let httpParams = new HttpParams();
    id.forEach((x) => {
      httpParams = httpParams.append('id', JSON.stringify(x));
    });

    return this.http.delete<ResponseWrapper>(this.GetUrl(), { params: httpParams });
  };
  get = (id: number) =>
    this.http.get<TResponseWrapper<LicenseViewModel>>(`${this.GetUrl()}/${id}`);

  patch = (request: PatchLicense) =>
    this.http.patch<ResponseWrapper>(
      `${this.api}/${this.GetUrl()}/inactivate`,
      {}
    );

  list = (options: GetLicenseList | null) => {
    let httpParams = new HttpParams();

    if (options != null) {
      Object.keys(options).forEach(function (key) {
        httpParams = httpParams.append(
          key,
          JSON.stringify(options[key as keyof GetLicenseList])
        );
      });
    }

    return this.http.get<GetListResponse<LicenseViewModel>>(this.GetUrl(), {
      params: httpParams,
    });
  };
}
