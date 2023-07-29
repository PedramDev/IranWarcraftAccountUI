import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetArticleList  , UpdateArticle,ArticleViewModel } from "src/app/models/blog/article";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse, PageStatus } from "src/app/models/shared-models";
import  { EnumExtension } from "src/app/utils/EnumExtension";

@Injectable()
export class AppArticleService {
    api = CONSTANST.routes.articles;
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
    get = (id: number) => this.http.get<TResponseWrapper<ArticleViewModel>>(`${this.api}/${id}`);

    inactivate = (id: number) => this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

    list = (options : GetArticleList | null) =>
    {
        let httpParams = new HttpParams();

        if(options != null){

            if(options.status != null){
                options.status = EnumExtension.toEnum(options.status,PageStatus);
            }

            Object.keys(options).forEach(function (key) {
                let value = options[key as keyof GetArticleList];
                if(value != null){
                    httpParams = httpParams.append(key, options[key as keyof GetArticleList]);
                }
            });
        }

        return this.http.get<GetListResponse<ArticleViewModel>>(this.api,{params:httpParams});
    } 

    update = (data: UpdateArticle) => this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);

    
}

