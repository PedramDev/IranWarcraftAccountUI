import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetRegionList , CreateRegion , UpdateRegion,RegionViewModel } from "src/app/models/shop/regions";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse } from "src/app/models/shared-models";

@Injectable()
export class AppRegionService {
    api = CONSTANST.routes.regions;
    constructor(
        private readonly http: HttpClient) { }
        
    add = (data: CreateRegion) => this.http.post<TResponseWrapper<number>>(this.api, data);

    delete = (id: number[]) =>
    {
        let httpParams = new HttpParams();
        id.forEach(x=>{
            httpParams = httpParams.append('id',JSON.stringify(x));
        });
        
        return this.http.delete<ResponseWrapper>(this.api, { params:httpParams });
    }
    get = (id: number) => this.http.get<TResponseWrapper<RegionViewModel>>(`${this.api}/${id}`);

    inactivate = (id: number) => this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

    list = (options : GetRegionList | null) =>
    {
        let httpParams = new HttpParams();

        if(options != null){
            Object.keys(options).forEach(function (key) {
                httpParams = httpParams.append(key, JSON.stringify(options[key as keyof GetRegionList]));
            });
        }

        return this.http.get<GetListResponse<RegionViewModel>>(this.api,{params:httpParams});
    } 

    update = (data: UpdateRegion) => this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}

