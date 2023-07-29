import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  GetUserList , UpdateUser,UserViewModel , CreateUser , ChangeUserRole, VerifyEmailOtp, CreateUserAttachment } from "src/app/models/user";
import { CONSTANST } from "src/app/utils/constanst";
import {TResponseWrapper , ResponseWrapper , GetListResponse } from "src/app/models/shared-models";

@Injectable()
export class AppUserService {
    seller = CONSTANST.routes.users.seller;
    moderator = CONSTANST.routes.users.moderator;
    constructor(
        private readonly http: HttpClient) { }



    sendMailOtp = () => this.http.post<ResponseWrapper>(this.seller + '/send-mail-otp', {});

    verifyMailOtp = (data : VerifyEmailOtp) => this.http.post<ResponseWrapper>(this.seller + '/verify-mail-otp', data);
    
    sendAttachment = (data : CreateUserAttachment) => this.http.post<ResponseWrapper>(this.seller + '/verify-mail-otp', data);
    updatePhone = (data : UpdateUserPhoneBySeller) => this.http.post<ResponseWrapper>(this.seller + '/phone', data);
    updateInfo = (data : UpdateUserInfoBySeller) => this.http.post<ResponseWrapper>(this.seller + '/info', data);



    changeRole = (data : ChangeUserRole)=> this.http.patch<ResponseWrapper>(this.api+`/${data.id}/change-role`, data);
        
    add = (data : CreateUser) => this.http.post<TResponseWrapper<number>>(this.api, data);

    delete = (id: number[]) =>
    {
        let httpParams = new HttpParams();
        id.forEach(x=>{
            httpParams = httpParams.append('id',JSON.stringify(x));
        });
        
        return this.http.delete<ResponseWrapper>(this.api, { params:httpParams });
    }
    get = (id: number) => this.http.get<TResponseWrapper<UserViewModel>>(`${this.api}/${id}`);

    list = (options ?: GetUserList) =>
    {
        let httpParams = new HttpParams();

        if(options != null){
            Object.keys(options).forEach(function (key) {
                let val = options[key as keyof GetUserList];

                if(Array.isArray(val)){
                    val.forEach(arrayItem => {
                        httpParams = httpParams.append(key, arrayItem);
                    });
                }
                else{
                    httpParams = httpParams.append(key, JSON.stringify(val));
                }

            });
        }

        return this.http.get<GetListResponse<UserViewModel>>(this.api,{params:httpParams});
    } 

    update = (data: UpdateUser) => this.http.put<ResponseWrapper>(`${this.api}/${data.id}`, data);

    me = ()=>this.http.get<TResponseWrapper<UserViewModel>>(CONSTANST.routes.me);
}

