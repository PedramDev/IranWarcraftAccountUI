import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetTicketList,
  TicketViewModel,
  CreateReplyByAdmin,
  CreateReplyByCustomer,
  CreateTicketByAdmin,
  CreateTicketByCustomer,
  PatchTicketByCustomer,
  PatchTicketByModerator,
  TicketStatus,
} from 'src/app/models/shared/ticket';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  GetListResponse,
} from 'src/app/models/shared-models';
import { AuthService } from './auth.service';
import { EnumExtension } from '../utils/EnumExtension';

@Injectable()
export class AppTicketService {
  api = CONSTANST.routes.tickets;
  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  private GetUrl() {
    let url: string;
    if (this.auth.isModerator() || this.auth.isStaff()) {
      url = this.api.moderator;
    } else if (this.auth.isCustomer()) {
      url = this.api.customer;
    } else {
      throw new TypeError('User unknown');
    }

    return url;
  }

  add(request: CreateTicketByAdmin | CreateTicketByCustomer) {
    return this.http.post<TResponseWrapper<number>>(this.GetUrl(), request);
  }
  addReply(request: CreateReplyByAdmin | CreateReplyByCustomer) {
    return this.http.post<TResponseWrapper<number>>(
      this.GetUrl() + `/${request.ticketId}`,
      request
    );
  }

  patch(request: PatchTicketByCustomer | PatchTicketByModerator) {
    return this.http.post<TResponseWrapper<number>>(
      this.GetUrl() + `/${request.id}`,
      request
    );
  }

  get = (id: number) =>
    this.http.get<TResponseWrapper<TicketViewModel>>(`${this.GetUrl()}/${id}`);

  list = (options: GetTicketList | null) => {
    let httpParams = new HttpParams();

    if(options != null){

      if(options.status != null){
          options.status = EnumExtension.toEnum(options.status,TicketStatus);
      }

      Object.keys(options).forEach(function (key) {
          let value = options[key as keyof GetTicketList];
          if(value != null){
              httpParams = httpParams.append(key, options[key as keyof GetTicketList]);
          }
      });
  }

    return this.http.get<GetListResponse<TicketViewModel>>(this.GetUrl(), {
      params: httpParams,
    });
  };

}
