import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  UpdateProduct,
  ProductViewModel,
  GetProductList,
} from 'src/app/models/shop/products';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
  PageStatus,
} from 'src/app/models/shared-models';
import  { EnumExtension } from "src/app/utils/EnumExtension";

@Injectable()
export class AppProductService {
  api = CONSTANST.routes.products;
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
    this.http.get<TResponseWrapper<ProductViewModel>>(`${this.api}/${id}`);

  inactivate = (id: number) =>
    this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

  list = (options: GetProductList | null) => {
    let httpParams = new HttpParams();
    
    if(options != null){

      if(options.status != null){
          options.status = EnumExtension.toEnum(options.status,PageStatus);
      }

      Object.keys(options).forEach(function (key) {
          let value = options[key as keyof GetProductList];
          if(value != null){
              httpParams = httpParams.append(key, options[key as keyof GetProductList]);
          }
      });
  }

    return this.http.get<GetListResponse<ProductViewModel>>(this.api, {
      params: httpParams,
    });
  };

  update = (data: UpdateProduct) =>
    this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);
}
