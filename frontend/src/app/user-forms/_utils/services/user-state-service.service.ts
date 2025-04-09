import { Injectable } from '@angular/core';
import { UserModel } from '../../_models/UserModel';
import { FakeAuthService } from './fake-auth.service';
import { RealAuthService } from './real-auth.service';
import { LocalStorageService } from './local-storage.service';
import { UniResponse } from '../http/uniresponse'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProfileOwnResponse, ResponseUtils } from '../http/responses';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private _fake_mode: boolean = false;
  private is_logged_subb: BehaviorSubject<boolean>;
  private last_action: BehaviorSubject<string>;
  private last_action_details: BehaviorSubject<any>;

  constructor(
        private authService: FakeAuthService, 
        private authServiceReal: RealAuthService,
        private localStorageService: LocalStorageService,
        private router: Router) {
      this.is_logged_subb = new BehaviorSubject(this.is_logged());
      this.last_action = new BehaviorSubject("");
      this.last_action_details = new BehaviorSubject(null);
  }

  // ===== business logic handling =====

  get is_fake_mode() {
    return this._fake_mode;
  }

  public log_out(): BehaviorSubject<string> {
    console.log ("====== LOG OUT!!! ");
    const token = this.get_current_token();
    
    if (!this._fake_mode) {
      this.authServiceReal.log_out(token).subscribe({
        next: (resp) => {
          console.log("LOG_OUT REAL ", resp);
          this.set_last_action("LOGGED_OUT");
          this._set_current_token(null);
          this._set_current_user(null);
          this._set_is_logged(false);
          this.is_logged_subb.next(false);
      
          this.router.navigateByUrl("/login");
        },
        error: (resp) => {
          console.log("LOG_OUT REAL - ERRORS ", resp);
        },
        complete: () => {

        }
      });
    } else {
      this.set_last_action("LOGGED_OUT");
      this._set_current_token(null);
      this._set_current_user(null);
      this._set_is_logged(false);
      this.is_logged_subb.next(false);
      this.router.navigateByUrl("/login");
    }

    return this.get_last_action();
  }

  public update_profile(email: string, first_name: string, last_name: string): BehaviorSubject<string> {
    const token = this.get_current_token();
    if ((token == undefined) || (token == null) || (token == "")) {
      this.set_last_action("TOKEN_ERROR_NOT_LOGGED");
      return this.get_last_action();
    }

    console.log ("====== update_profile - token ", token);

    if (this.is_fake_mode) {
      console.log("FAKE - UPDATE_PROFILE");
      const current_user = this.get_current_user();
      if((current_user == undefined) || (current_user == null) || (current_user.empty )) {
        throw new RangeError("User not defined");
      }
      // e-mail was not changed, don't update it
      if ((email != current_user.email)) {
        const resp = this.authService.update_user_email(current_user.id, current_user.email, 
          email, token);
        console.log("=== RESP ", resp);
        if ((resp.code == 1)  && (resp.data_json_as_obj != undefined) && (resp.data_json_as_obj != null)) {
          const updated_user = resp.data_json_as_obj;
          console.log("UPDATED USER ", updated_user);
          this._set_current_user(updated_user);
        }
      }
      this.set_last_action("PROFILE_UPDATE_OK");
    } else {
      this.authServiceReal.profile_own_update(token, email, first_name, last_name).subscribe({        
          next: (resp) => {
            console.log("REAL - UPDATE_PROFILE", resp);
            const ownResp = resp.body as ProfileOwnResponse;
            console.log("ownResp name ", ownResp.constructor.name);
            this._set_current_user(ProfileOwnResponse.get_user_from_response_body(resp.body));
            console.log("Current user ", this.get_current_user());
            this.set_last_action("PROFILE_UPDATE_OK");
          },
          error: (resp) => {
            console.log("REAL - UPDATE_PROFILE ERROR", resp);
            if (ResponseUtils.resp_error_email_already_taken(resp)) {
              this.set_last_action("PROFILE_UPDATE_ERROR_ALREADY_EXISTS");
            } else {
              this.set_last_action("PROFILE_UPDATE_ERROR");
            }
          },
          complete: () => {}
      });
    }

    return this.get_last_action();
  }


  public update_password(current_password_to_check: string, new_password: string): BehaviorSubject<string> {
    const token = this.get_current_token();
    if ((token == undefined) || (token == null) || (token == "")) {
      this.set_last_action("TOKEN_ERROR_NOT_LOGGED");
      return this.get_last_action();
    }

    if (this.is_fake_mode) {
      const current_user = this.get_current_user();
      if((current_user == undefined) || (current_user == null) || (current_user.empty )) {
        throw new RangeError("User not defined");
      }  
      const resp = this.authService.update_user_password(current_user.id, current_user.email, 
        current_password_to_check, new_password, this.get_current_token());  
      console.log("=== RESP ", resp);
      if ((resp.code == UniResponse.CODE_OK)  && (resp.data_json_as_obj != undefined) && (resp.data_json_as_obj != null)) {
        const updated_user = resp.data_json_as_obj;
        console.log("UPDATED USER ", updated_user);
        this._set_current_user(updated_user);
        this.set_last_action("PASSWORD_CHANGE_ERROR");
      } else {
        this.set_last_action("PASSWORD_CHANGE_ERROR");
      }
    } else {
      this.authServiceReal.profile_own_change_password(token, current_password_to_check, new_password).subscribe({
        next: (resp) => {
          console.log("REAL - UPDATE_PASSWORD", resp);
          this.set_last_action("PASSWORD_CHANGE_OK");
        },
        error: (resp) => {
          console.log("REAL - UPDATE_PASSWORD ERROR ", resp);
          this.set_last_action("PASSWORD_CHANGE_ERROR");
        },
        complete: () => {}
      }
        
        
    
    );
    }

    return this.get_last_action();   
  }


  public log_in(email: string, password: string): BehaviorSubject<string> {
    if (this.is_fake_mode) {
      const resp = this.authService.log_in(email, password);
      console.log("==== login-1 - user resp", resp  );
  
      if ((resp.code == UniResponse.CODE_OK) && (resp.http_code == UniResponse.HTTP_CODE_200_OK) && 
            (resp.data_json_as_obj != undefined) &&  (resp.data_json_as_obj != null) && (!resp.data_json_as_obj.empty)) {
        this._set_is_logged(true);
        this._set_current_user(resp.data_json_as_obj);
        this._set_current_token(resp.data_json_as_obj.token);
        this.is_logged_subb.next(true);
        this.set_last_action("LOGIN_OK");
      }
    } else {
      console.log("login-2 - real");
      this.authServiceReal.log_in(email, password).
        subscribe({
          next: (resp) => {
            this._set_is_logged(true);
            this.is_logged_subb.next(true);
            const curUser = UserModel.from_login_response(resp.body);
            // console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQq CUR USER FROM LOGIN RESPONSE ", curUser);
            // this if is always true in "next",
            // but Angular requires to check existence of referred items, so I do it
            this._set_current_token(((resp.body != undefined) && (resp.body != null))?resp.body.token: null);
            this._set_current_user(curUser);
            this.set_last_action("LOGIN_OK");
            console.log("data XXXX", resp, "body ", resp.body, resp?.body?.id, resp?.body?.email, resp?.body?.first_name, resp?.body?.last_name);
          },
          error: (resp) => {
            console.log("LOGIN ERROR ", resp);
            this.set_last_action("LOGIN_ERROR");
          }, 
          complete: () => {}
      });
    }

    return this.get_last_action();
  }

  private _gather_error_details(data: any) {
    return {
      error: ((data.error != undefined) && (data.error != null))? data.error: null,
      status_code: data.status,
      status_text: data.statusText,
    };
  }

  public register(email: string, password: string, first_name: string, last_name: string): BehaviorSubject<string> {
    if (this.is_fake_mode) {
      const resp = this.authService.register(email, password);
      this.set_last_action("REGISTER_OK");
      console.log("==== register-1 - user resp", resp);
    } else {
      console.log("==== register-2 - real");
      this.authServiceReal.register_create(email, password, first_name, last_name).subscribe(
      {
        next: (data) => {
          console.log("REGISTER -- REGISTER_OK ", data);
          this.set_last_action("REGISTER_OK");
        },
        error: (data) => {
          console.log("REGISTER -- REGISTER ERROR ", data);
          const error_details = this._gather_error_details(data);
          console.log("ERROR DETAILS ", error_details);
        
          if (ResponseUtils.resp_error_email_already_taken(data)) {
            this.set_last_action("REGISTER_ERROR_ALREADY_EXISTS");
          } else {
            this.set_last_action("REGISTER_ERROR");
          }
          this.set_last_action_details(error_details);
        },
        complete: () => {
          console.log("REGISTER -- COMPLETE ");
        }
      });
        
      //   {resp => {
      //   console.log("REAL - REGISTRATION ", resp);
      //   this.set_last_action("REGISTER_OK");

      // }, error => {
      //   console.log("REGISTER ERROR ")
      //   this.set_last_action("REGISTER_ERROR");
      // }
    
    }

    return this.get_last_action();
  }

  public confirm_registration(email: string, register_confirm_token: string ): BehaviorSubject<string> {
    if (this.is_fake_mode) {
      const resp = this.authService.confirm_registration(email, register_confirm_token);
      console.log("==== confirm_registration-1 - user resp", resp);
      this.set_last_action("REGISTER_CONFIRM_OK");
    } else {
      this.authServiceReal.register_confirm(email, register_confirm_token).subscribe(
        {
          next: (resp) => {
            console.log("REAL - REGISTRATION CONFIRM OK", resp);
            this.set_last_action("REGISTER_CONFIRM_OK");
          },
          error: (resp) => {
            console.log("=== confirm_registration ERROR ", resp);
            this.set_last_action("REGISTER_CONFIRM_ERROR");
          },

          complete: () => {}
        }        
    
    );
    }

    return this.get_last_action();
  }

  public send_reset_password_request(email: string): BehaviorSubject<string> {
    if (this.is_fake_mode) {
      const resp = this.authService.send_reset_password_request(email);
      console.log("==== send_reset_password_request-1 - user resp", resp);
      this.set_last_action("RESET_PASSWORD_SEND_OK");
    } else {
      this.authServiceReal.reset_password_send_request(email).subscribe(resp => {
        console.log("REAL - SEND_RESET_PASSWORD ", resp);
        if (resp.status == UniResponse.HTTP_CODE_200_OK) {
          this.set_last_action("RESET_PASSWORD_SEND_OK");
        } else {
          this.set_last_action("RESET_PASSWORD_SEND_ERROR");
        }
      });
    }

    return this.get_last_action();
  }

  public confirm_password_reset(email: string, password_reset_token: string, new_password: string): BehaviorSubject<string> {
    if (this.is_fake_mode) {
      const resp = this.authService.confirm_password_reset(email, password_reset_token, new_password);
      console.log("==== confirm_password_reset-1 - resp", resp);
    } else {
      this.authServiceReal.reset_password_confirm(email, password_reset_token, new_password).subscribe({
        next: resp => {
          console.log("REAL - confirm_password_reset", resp);
          this.set_last_action("RESET_PASSWORD_CONFIRM_OK");
        },
        error: (resp) => {
          console.log("REAL - confirm_password_reset - ERRORS ", resp);
          this.set_last_action("RESET_PASSWORD_CONFIRM_ERROR");
        },
        complete: () => {}
      });
    }
    
    return this.get_last_action();
  }
  

  // ===== state storage handling =====
  public is_logged(): boolean {
    return this.localStorageService.get_boolean_from_item("is_logged");
  }

  public is_logged_and_admin(): boolean {
    const cur_user = this.get_current_user();
    // console.log("=========================== CUR USER: ", cur_user);
    return ((this.is_logged()) && (cur_user != null) && cur_user.get_is_staff());
  }

  public is_logged_sub(): BehaviorSubject<boolean> {
    return this.is_logged_subb;
  }

  public get_last_action(): BehaviorSubject<string> {
    return this.last_action;
  }

  public set_last_action(l_action: string) {
    this.last_action.next(l_action);
  }

  public set_last_action_details(details: any) {
    this.last_action_details.next(details);
  }

  private _set_is_logged(is_logged: boolean) {
    this.localStorageService.set_item_from_boolean("is_logged", is_logged);
  }
 
  public get_current_user(): UserModel|null {
    const user_in = this.localStorageService.get_object_from_item("current_user");
    // console.log("GET CURRENT USER --- ", user_in);
    return UserModel.from_object(user_in);
  }

  public get_current_token(): string {
    const token = this.localStorageService.get_object_from_item("current_token");
    // console.log("get_current_token --- ", token);
    return token;
  }

  private _set_current_user(user: UserModel|null) {
    console.log("==== UserStateService - _set_current_user: ", user);
    this.localStorageService.set_item_from_object("current_user", user);
  }

  private _set_current_token(token: string|null) {
    console.log("==== UserStateService - _set_current_token: ", token);
    this.localStorageService.set_item_from_object("current_token", token);
  }

}
