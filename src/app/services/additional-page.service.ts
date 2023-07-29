import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetAdditionalPageList  , UpdateAdditionalPage,AdditionalPageViewModel } from "src/app/models/shared/additional-page";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse, PageStatus } from "src/app/models/shared-models";
import { EnumExtension } from "../utils/EnumExtension";

@Injectable()
export class AppAdditionalPageService {
    api = CONSTANST.routes.additionalPages;
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
    get = (id: number) => this.http.get<TResponseWrapper<AdditionalPageViewModel>>(`${this.api}/${id}`);


    list = (options : GetAdditionalPageList | null) =>
    {
        let httpParams = new HttpParams();

        if(options != null){

            if(options.status != null){
                options.status = EnumExtension.toEnum(options.status,PageStatus);
            }

            Object.keys(options).forEach(function (key) {
                let value = options[key as keyof GetAdditionalPageList];
                if(value != null){
                    httpParams = httpParams.append(key, options[key as keyof GetAdditionalPageList]);
                }
            });
        }

        return this.http.get<GetListResponse<AdditionalPageViewModel>>(this.api,{params:httpParams});
    } 

    update = (data: UpdateAdditionalPage) => this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}

