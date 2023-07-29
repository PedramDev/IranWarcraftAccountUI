import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetContactMessageList , PatchContactMessage,ContactMessageViewModel } from "src/app/models/shared/contact-message";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse } from "src/app/models/shared-models";

@Injectable()
export class AppContactMessageService {
    api = CONSTANST.routes.contactMessage;
    constructor(
        private readonly http: HttpClient) { }
        
    add = () => this.http.post<TResponseWrapper<number>>(this.api, {});

    delete = (id: number[]) =>
    {
        let httpParams = new HttpParams();
        id.forEach(x=>{
            httpParams = httpParams.append('id',JSON.stringify(x));
        });
        
        return this.http.delete<ResponseWrapper>(this.api, { params:httpParams });
    }
    get = (id: number) => this.http.get<TResponseWrapper<ContactMessageViewModel>>(`${this.api}/${id}`);


    list = (options : GetContactMessageList | null) =>
    {
        let httpParams = new HttpParams();

        if(options != null){
            Object.keys(options).forEach(function (key) {
                httpParams = httpParams.append(key, JSON.stringify(options[key as keyof GetContactMessageList]));
            });
        }

        return this.http.get<GetListResponse<ContactMessageViewModel>>(this.api,{params:httpParams});
    } 

    patch = (data: PatchContactMessage) => this.http.patch<ResponseWrapper>(`${this.api}/${data.id}`, data);
}

