import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetCommentList , CreateComment , UpdateComment,CommentViewModel } from "src/app/models/blog/comment";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse } from "src/app/models/shared-models";
import { EnumExtension } from "../utils/EnumExtension";
import { CommentStatus } from "../models/blog/comment/enums/CommentStatus";

@Injectable()
export class AppCommentService {
    api = CONSTANST.routes.comments;
    constructor(
        private readonly http: HttpClient) { }
        
    add = (data: CreateComment) => this.http.post<TResponseWrapper<number>>(this.api, data);

    delete = (id: number[]) =>
    {
        let httpParams = new HttpParams();
        id.forEach(x=>{
            httpParams = httpParams.append('id',JSON.stringify(x));
        });
        
        return this.http.delete<ResponseWrapper>(this.api, { params:httpParams });
    }
    get = (id: number) => this.http.get<TResponseWrapper<CommentViewModel>>(`${this.api}/${id}`);

    inactivate = (id: number) => this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

    list = (options : GetCommentList | null) =>
    {
        let httpParams = new HttpParams();

        if(options != null){

            if(options.status != null){
                options.status = EnumExtension.toEnum(options.status,CommentStatus);
            }

            Object.keys(options).forEach(function (key) {
                let value = options[key as keyof GetCommentList];
                if(value != null){
                    httpParams = httpParams.append(key, options[key as keyof GetCommentList]);
                }
            });
        }

        return this.http.get<GetListResponse<CommentViewModel>>(this.api,{params:httpParams});
    } 

    update = (data: UpdateComment) => this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}

