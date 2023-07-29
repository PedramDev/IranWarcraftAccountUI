import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  SystemSettingViewModel,UpdateSystemSetting } from "src/app/models/shared/system-setting";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper } from "src/app/models/shared-models";

@Injectable()
export class AppSystemSettingService {
    api = CONSTANST.routes.systemSetting;
    constructor(
        private readonly http: HttpClient) { }
        
    get = (id: number) => this.http.get<TResponseWrapper<SystemSettingViewModel>>(`${this.api}/${id}`);

    update = (data: UpdateSystemSetting) => this.http.put<ResponseWrapper>(`${this.api}`, data);
}

