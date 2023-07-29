import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UpdateProductCategory,
  ProductCategoryViewModel,
  GetProductCategoryList,
} from 'src/app/models/shop/product-category';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
  PageStatus,
} from 'src/app/models/shared-models';
import { EnumExtension } from '../utils/EnumExtension';

@Injectable()
export class AppProductCategoryService {
  api = CONSTANST.routes.productcategories;
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
    this.http.get<TResponseWrapper<ProductCategoryViewModel>>(`${this.api}/${id}`);

  inactivate = (id: number) =>
    this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

  list = (options: GetProductCategoryList | null) => {
    let httpParams = new HttpParams();

    if(options.status != null){
      options.status = EnumExtension.toEnum(options.status,PageStatus);
  }
  
  Object.keys(options).forEach(function (key) {
      let value = options[key as keyof GetProductCategoryList];
      if(value != null){
          httpParams = httpParams.append(key, options[key as keyof GetProductCategoryList]);
      }
  });

    return this.http.get<GetListResponse<ProductCategoryViewModel>>(this.api, {
      params: httpParams,
    });
  };

  update = (data: UpdateProductCategory) =>
    this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}
