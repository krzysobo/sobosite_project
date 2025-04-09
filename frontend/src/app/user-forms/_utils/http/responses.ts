import { UserModel } from "../../_models/UserModel";

export class LoginResponse {
    public id: string|null = "";
    public status: number|null = 0;
    public email: string|null = "";
    public token: string|null = "";
    public first_name: string|null = "";
    public last_name: string|null = "";
    public is_staff: boolean = false;
}


export class ProfileOwnResponse {
  public id: string|null = "";
  public status: number|null = 0;
  public is_staff: boolean = false;
  public role: string|null = "USR";   // USR or ADM
  public email: string|null = "";
  // public token: string|null = "";
  public first_name: string|null = "";
  public last_name: string|null = "";

  constructor() { }

  public static get_user_from_response_body(body: any): UserModel|null {
    if ((body != undefined) && (body != null)) {
      const user = new UserModel(body.id, body.email, "", null, body.status, body.first_name, body.last_name)
      user.set_is_staff(body.is_staff);
      user.set_role(body.role);
      return user;
    }

    return null;
  }
}


export class ProfileOwnChangePasswordResponse {
}

export class LogoutResponse {
}


export class RegisterResponse {
  public email: string|null = "";
  public first_name: string|null = "";
  public last_name: string|null = "";
}


export class RegisterConfirmResponse {

}

export class ResetPasswordResponse {

}

export class ResetPasswordConfirmResponse {

}

// -------------- admin panel responses ------------
export class AdminUserGetResponse {
  public id: string|null = "";
  public status: number|null = 0;
  public is_staff: boolean = false;
  public is_active: boolean = false;
  public role: string|null = "USR";   // USR or ADM
  public email: string|null = "";

  public first_name: string|null = "";
  public last_name: string|null = "";

  public no_failed_logins: number = 0;
  public failed_is_blocked: boolean = false;
  public failed_is_blocked_thru: any = null;

  // public static get_user_from_response_body(body: any): UserModel|null {
  //   if ((body != undefined) && (body != null)) {
  //     const user = new UserModel(body.id, body.email, "", null, body.status, body.first_name, body.last_name)
  //     user.set_is_staff(body.is_staff);
  //     user.set_role(body.role);
  //     return user;
  //   }

  //   return null;
  // }

}


/*
{
"id":"7bc78e20-37ae-45c2-b1f7-9977d508fb87",
"status":...
"is_staff":true,
"is_active":true,
"role":"ADM",
"email":"costam@example.com",

"first_name":"Tester",
"last_name":"Testowy",

"no_failed_logins":0,
"failed_is_blocked":false,
"failed_is_blocked_thru":null}

*/
export class AdminUserListResponse {
  
}

export class AdminUserDeleteResponse {
  
}


export class ResponseUtils {
  private static _find_index_in_array(needle: string, stack: any) {
    return stack.findIndex((item: string) => { return item.indexOf(needle) != -1})
  }

  public static resp_error_email_already_taken(data: any) {
    return ((data.error != undefined) && (data.error != null) && 
      (data.error.email != undefined) && (data.error.email != null) && 
      (Array.isArray(data.error.email)) && (data.error.email.length > 0) && 
        (ResponseUtils._find_index_in_array('already exists', data.error.email) != -1));
  }

}
