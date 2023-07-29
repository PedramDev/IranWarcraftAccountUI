import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANST } from 'src/app/utils/constanst';
import {
  TResponseWrapper,
} from 'src/app/models/shared-models';
import { CreateTempUploadResponse } from "src/app/models/shared/temp";

@Injectable()
export class AppTempFileService {
  private api = CONSTANST.routes.tempFile;
  constructor(
    private readonly http: HttpClient
  ) {}


  upload(file: any){
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<TResponseWrapper<CreateTempUploadResponse>>(this.api, formData);
  }
  
}
