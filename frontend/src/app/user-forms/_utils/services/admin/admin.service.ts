import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUserDeleteResponse, AdminUserGetResponse, AdminUserListResponse, LoginResponse, LogoutResponse, ProfileOwnChangePasswordResponse, ProfileOwnResponse, RegisterConfirmResponse, RegisterResponse, ResetPasswordConfirmResponse, ResetPasswordResponse } from '../../http/responses';
import { UserStateService } from '../user-state-service.service';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _api_prefix = 'http://localhost:3000/api/v1/';
  private _api_url_admin_user_get = this._api_prefix + "admin/user/id/{id}/";
  private _api_url_admin_user_update = this._api_prefix + "admin/user/id/{id}/";
  private _api_url_admin_user_delete = this._api_prefix + "admin/user/id/{id}/";
  private _api_url_admin_user_create = this._api_prefix + "admin/user/create/";
  private _api_url_admin_user_list = this._api_prefix + "admin/user/";

  constructor(private http: HttpClient, private userStateService: UserStateService) { }

  // ------------------ administrator panels -------------------
  public admin_user_list_get(): Observable<HttpResponse<AdminUserListResponse>> {
    const token = this.userStateService.get_current_token();
    console.log("AdminService - admin_user_list_get", token);
    return this.http.get<AdminUserListResponse>(
      this._api_url_admin_user_list,
      { observe: "response",
        "headers": {
          "Authorization": "Token " + token
      }}
    );
  }

  public admin_user_get(user_id: string): Observable<HttpResponse<AdminUserGetResponse>> {
    const token = this.userStateService.get_current_token();

    console.log("AdminService - admin_user_get", token, user_id);
    return this.http.get<AdminUserGetResponse>(
      this._api_url_admin_user_get.replace(/{id}/gi, user_id),
      { observe: "response",
        "headers": {
          "Authorization": "Token " + token
      }}
    );
  }

  public admin_user_update(user_id: string, user_data: any): Observable<HttpResponse<AdminUserGetResponse>> {
    const token = this.userStateService.get_current_token();

    console.log("AdminService - admin_user_update", token, user_id, user_data);
    return this.http.put<AdminUserGetResponse>(
      this._api_url_admin_user_update.replace(/{id}/gi, user_id),
      user_data,
      { observe: "response",
        "headers": {
          "Authorization": "Token " + token
      }}
    );
  }

  public admin_user_delete(user_id: string): Observable<HttpResponse<AdminUserDeleteResponse>> {
    const token = this.userStateService.get_current_token();

    console.log("AdminService - admin_user_delete", token, user_id);
    return this.http.delete<AdminUserDeleteResponse>(
      this._api_url_admin_user_delete.replace(/{id}/gi, user_id),
      { observe: "response",
        "headers": {
          "Authorization": "Token " + token
      }}
    );
  }

  public admin_user_create(user_data: any): Observable<HttpResponse<AdminUserGetResponse>> {
    const token = this.userStateService.get_current_token();

    console.log("AdminService - admin_user_create", token, user_data);
    return this.http.post<AdminUserGetResponse>(
      this._api_url_admin_user_create,
      user_data,
      { observe: "response",
        "headers": {
          "Authorization": "Token " + token
      }}
    );
  }



  // ------------------ /administrator panels -------------------

}
