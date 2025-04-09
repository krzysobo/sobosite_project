import { LoginResponse } from "../_utils/http/responses";

export class UserModel {
    public static STATUS_UNDEFINED: number = 0;
    public static STATUS_NEW: number = 10;
    public static STATUS_REJECTED: number = 15;
    public static STATUS_ACCEPTED: number = 20;
    public static STATUS_DELETED: number = -1;


    public id: string|null
    public email: string|null
    public status: number|null = 0;
    // public token: string|null
    public first_name: string|null
    public last_name: string|null
    private _pass_tmp: string|null     // TODO: this will be REMOVED in the Backend-using version
    private _role: string|null = "USR";
    private _is_staff: boolean = false;

  
    constructor(id: string|null, email: string|null, password: string|null, token: string|null, status: number|null, first_name: string|null, last_name: string|null) {
      this.id = id;
      this.email = email;
      this._pass_tmp = password;
      // this.token = token;
      this.status = status;
      this.first_name = first_name;
      this.last_name = last_name;
    }

    public set_password(password: string|null) {
      this._pass_tmp = password;
    }

    public get_password(): string|null|undefined {
      return this._pass_tmp;
    }

    public set_role(role: string|null) {
      this._role = role;
    }

    public get_role(): string|null|undefined {
      return this._role;
    }

    public set_is_staff(is_staff: boolean) {
      this._is_staff = is_staff;
    }

    public get_is_staff(): boolean {
      return this._is_staff;
    }

    get empty() {
      return (((this.id == undefined) || (this.id == null) || (this.id == "")) &&
        ((this.email == undefined) || (this.email == null) || (this.email == "")));
    }

    public to_string(): string {
      return JSON.stringify(this);
    }

    public static from_string(obj_str: string): UserModel|null {
      try{
        const obj = JSON.parse(obj_str);
        return obj;
      } catch (SyntaxError) {
        return null;
      }
    }

    public static from_login_response(body: LoginResponse|null): UserModel|null {
      if(body) {
        const res =  new UserModel(body.id, body.email, null, null, body.status ,body.first_name, body.last_name);
        res.set_is_staff(body.is_staff);
        console.log("from_login_response: ", res);
        return res;
      } else {
        return null;
        // return new UserModel(null, null, null, null, null, null, null);
      }
    }

    public static from_object(obj: any): UserModel|null {
      if ((obj == undefined) || (obj == null) ||
          (obj.id == undefined) || (obj.id == null) || (obj.id === '') ||
          (obj.email == undefined) || (obj.email == null) || (obj.email == '')) {
        return null;
      }

      // let token = ((obj.token != undefined) && (obj.token != null))? obj.token: "";
      let status = ((obj.status != undefined) && (obj.status != null) && (!isNaN(obj.status)))? obj.status: UserModel.STATUS_UNDEFINED;
      let first_name = ((obj.first_name != undefined) && (obj.first_name != null))? obj.first_name: "";
      let last_name = ((obj.last_name != undefined) && (obj.last_name != null))? obj.last_name: "";
      let pass_tmp = ((obj._pass_tmp != undefined) && (obj._pass_tmp != null))? obj._pass_tmp: "";

      const user = new UserModel(obj.id, obj.email, pass_tmp, null, status, first_name, last_name);
      user.set_is_staff(((obj._is_staff != undefined) && (obj._is_staff != null)) ?obj._is_staff: false);
      return user;
    }

    public static make_newly_registered_for_fake_auth(id: string, email: string, password: string) {
      const user = new UserModel(id, email, password, '', UserModel.STATUS_NEW, '', '');
      user.status = UserModel.STATUS_NEW;

      return user;
    }
  }