import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetMediaList,
  CreateMedia,
  MediaViewModel,
  MediaType,
} from 'src/app/models/media';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
  ResponseWrapper,
  GetListResponse,
} from 'src/app/models/shared-models';

@Injectable()
export class AppMediaService {
  api = CONSTANST.routes.media;
  constructor(private readonly http: HttpClient) {}

  add = (data: CreateMedia) =>
    this.http.post<TResponseWrapper<number>>(this.api, data);

  delete = (id: number, type: MediaType) => {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('type', type);

    return this.http.delete<ResponseWrapper>(this.api, { params: httpParams });
  };
  get = (id: number) =>
    this.http.get<TResponseWrapper<MediaViewModel>>(`${this.api}/${id}`);

  inactivate = (id: number) =>
    this.http.patch<ResponseWrapper>(`${this.api}/${id}/inactivate`, {});

  list = (options: GetMediaList | null) => {
    let httpParams = new HttpParams();

    if (options != null) {
      Object.keys(options).forEach(function (key) {
        httpParams = httpParams.append(
          key,
          JSON.stringify(options[key as keyof GetMediaList])
        );
      });
    }

    return this.http.get<GetListResponse<MediaViewModel>>(this.api, {
      params: httpParams,
    });
  };

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
}
