import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as model from 'src/app/models/shared/bank-accounts';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
} from 'src/app/models/shared-models';
import { AuthService } from './auth.service';

@Injectable()
export class AppBankAccountService {
  api = CONSTANST.routes.bankaccounts;
  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  private GetUrl() {
    let url: string;
    if (this.auth.isModerator()) {
      url = this.api.moderator;
    } else {
      url = this.api.seller;
    }

    return url;
  }

  add = (data: model.CreateBankAccount) =>
    this.http.post<TResponseWrapper<number>>(this.GetUrl(), data);

  delete = (id: number[]) => {
    let httpParams = new HttpParams();
    id.forEach((x) => {
      httpParams = httpParams.append('id', JSON.stringify(x));
    });

    return this.http.delete<ResponseWrapper>(this.GetUrl(), {
      params: httpParams,
    });
  };
  get = (id: number) =>
    this.http.get<TResponseWrapper<model.BankAccountViewModel>>(
      `${this.GetUrl()}/${id}`
    );

  inactivate = (id: number) =>
    this.http.patch<ResponseWrapper>(`${this.GetUrl()}/${id}/inactivate`, {});

  list = (options: model.GetBankAccountList | null) => {
    let httpParams = new HttpParams();

    if (options != null) {
      Object.keys(options).forEach(function (key) {
        httpParams = httpParams.append(
          key,
          JSON.stringify(options[key as keyof model.GetBankAccountList])
        );
      });
    }

    return this.http.get<GetListResponse<model.BankAccountViewModel>>(
      this.GetUrl(),
      { params: httpParams }
    );
  };

  update = (data: model.UpdateBankAccount) =>
    this.http.put<ResponseWrapper>(`${this.GetUrl()}/${data.id}`, data);

  patch(data: model.PatchBankAccount) {
    return this.http.patch<ResponseWrapper>(
      `${this.GetUrl()}/${data.id}`,
      data
    );
  }
}
