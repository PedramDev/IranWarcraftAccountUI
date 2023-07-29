import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UpdateArticleCategory,
  ArticleCategoryViewModel,
  GetArticleCategoryList,
} from 'src/app/models/blog/article-category';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
  PageStatus,
} from 'src/app/models/shared-models';
import { EnumExtension } from '../utils/EnumExtension';

@Injectable()
export class AppArticleCategoryService {
  api = CONSTANST.routes.articlecategories;
  constructor(private readonly http: HttpClient) {}

  add = () =>
    this.http.post<TResponseWrapper<number>>(this.api, {});

  delete = (id: number[]) => {
    let httpParams = new HttpParams();
    id.forEach((x) => {
      httpParams = httpParams.append('id', JSON.stringify(x));
    });

    return this.http.delete<ResponseWrapper>(this.api, { params: httpParams });
  };
  get = (id: number) =>
    this.http.get<TResponseWrapper<ArticleCategoryViewModel>>(`${this.api}/${id}`);

  inactivate = (id: number) =>
    this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

  list = (options: GetArticleCategoryList | null) => {
    let httpParams = new HttpParams();

    if(options.status != null){
      options.status = EnumExtension.toEnum(options.status,PageStatus);
  }
  
  Object.keys(options).forEach(function (key) {
      let value = options[key as keyof GetArticleCategoryList];
      if(value != null){
          httpParams = httpParams.append(key, options[key as keyof GetArticleCategoryList]);
      }
  });

    return this.http.get<GetListResponse<ArticleCategoryViewModel>>(this.api, {
      params: httpParams,
    });
  };

  update = (data: UpdateArticleCategory) =>
    this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}
