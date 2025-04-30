import { Injectable } from '@angular/core';
import { UserModel } from '../../_models/UserModel';
import { LocalStorageService } from '../../../sobo-common/_utils/services/local-storage.service';
import { UniResponse } from '../http/uniresponse'


@Injectable({
  providedIn: 'root'
})
export class FakeAuthService {

  constructor(private localStorageService: LocalStorageService) {
    // this._set_test_users(null);
    let test_users = this._get_test_users();
    // console.log("=== FakeAuthService - test_users - 1", test_users);
    // console.log("=== FakeAuthService - registration confirmations ", this._get_registration_confirmations());
    // console.log("=== FakeAuthService - password_reset_requests ", this._get_password_reset_requests());
    if((test_users == undefined) || (test_users == null) || (test_users.length < 1)) {
      this._set_test_users(this._fixture_test_users());
      test_users = this._get_test_users();
      // console.log("=== test users - 2", test_users);
    }
  }

  // =========== business logic ===========
  public log_in(email: string, password: string): UniResponse {
    const user = this._get_user_with_email(email);
    if ((user == undefined) || (user == null) || (user.empty)) {    // user doesn't exist
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_FAILED, null, null);
    }
    console.log("==== log_in - user:: ", user, user.constructor.name);
    if (user.get_password() != password) {                          // user exists, but the password is wrong
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_FAILED, null, null);
    }

    if (user.status != UserModel.STATUS_ACCEPTED) {
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_FAILED, null, null);
    }

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, null, user.to_string());
  }

  public register(email: string, password: string): UniResponse {
    const test_user = this._get_user_with_email(email);
    if ((test_user != undefined) && (test_user != null) && (!test_user.empty)) {  // user already exists
      console.log("==== log_in - user already exists:: ", test_user, test_user.constructor.name);
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_ALREADY_EXISTS, null, null);
    }

    const res = this._add_user(email, password);
    console.log("FakeAuthService::register - RES ", res);

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, res[1], null);
  }

  public confirm_registration(email: string, register_confirm_token: string ): UniResponse {
    const test_user = this._get_user_with_email_and_register_confirm_token(email, register_confirm_token);
    if ((test_user == undefined) || (test_user == null) || (test_user.empty)) {  // user already exists
      console.log("==== confirm_registration - user not found ", email, register_confirm_token);
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    test_user.status = UserModel.STATUS_ACCEPTED;
    this._save_user(test_user);
    this._delete_registration_confirmation(email, test_user?.id, register_confirm_token);


    console.log("==== confirm_registration - user found and accepted. Users now: ", this._get_test_users());

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, null, null);
  }

  public send_reset_password_request(email: string): UniResponse {
    const test_user = this._get_user_with_email(email);
    if ((test_user == undefined) || (test_user == null) || (test_user.empty)) {  // user already exists
      console.log("==== confirm_registration - user not found ", email);
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    const password_reset_token = "QqRYQ_" + (Math.random() + 1).toString(36).substring(10) +
    "__" + (Math.random() + 1).toString(32).substring(7) + "__" + (Math.random() + 1).toString(36).substring(7) +
    (Math.random() + 76 + Date.now()).toString(36).substring(7) + (Math.random() + 1 +
      Date.now()-666 % 2).toString(19).substring(7) + (Math.random() + 20 * Date.now()- 7 *
      Math.random()).toString(36).substring(7) + (Math.random() + 1).toString(18).substring(9) + "____" +
       (Math.random() + 30 * Date.now()- 18 * Math.random()-55666) + (Math.random() + 30 * Date.now() % 18 * Math.random()-55666);

    this._add_password_reset_request(email, test_user?.id, password_reset_token);

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, password_reset_token, null);
  }

  public confirm_password_reset(email: string, password_reset_token: string, password: string) {
    const test_user = this._get_user_with_email(email);
    if ((test_user == undefined) || (test_user == null) || (test_user.empty)) {  // user already exists
      console.log("==== confirm_password_reset - user not found ", email);
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    console.log("test user email ", email, test_user, password_reset_token);
    console.log("password reset requests ", this._get_password_reset_requests());
    const req = this._get_password_reset_request(email, test_user?.id, password_reset_token);
    if ((req == undefined) || (req == null)) {
      console.log("==== confirm_password_reset - user not found-2", email);
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    test_user.set_password(password);
    this._save_user(test_user);

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, null, test_user.to_string());
  }


  public update_user_email(id: any, current_email: any, new_email: any, token: any): UniResponse {
    if(!this._auth_with_token(token)) {
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_UNAUTHORIZED, null, null);
    }

    const user = this._get_user_with_id_and_email(id, current_email);
    if ((user==undefined) || (user == null) || (user.empty)) {
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    if(this._check_user_exists_with_another_id(
      new_email, id,token)) {
        return new UniResponse(UniResponse.HTTP_CODE_403_FORBIDDEN, UniResponse.CODE_ALREADY_EXISTS, null, null);
    }

    user.email = new_email;
    this._save_user(user);

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, null, user.to_string());
  }

  public update_user_password(id: any, email: any, current_password_to_check: any, new_password: any, token: any) {
    if(!this._auth_with_token(token)) {
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_UNAUTHORIZED, null, null);
    }

    const user = this._get_user_with_id_and_email(id, email);
    if ((user==undefined) || (user == null) || (user.empty)) {
      return new UniResponse(UniResponse.HTTP_CODE_404_NOT_FOUND, UniResponse.CODE_NOT_FOUND, null, null);
    }

    if(user.get_password() != current_password_to_check) {
      return new UniResponse(UniResponse.HTTP_CODE_401_UNAUTHORIZED, UniResponse.CODE_FAILED, null, null);
    }

    user.set_password(new_password);
    this._save_user(user);

    return new UniResponse(UniResponse.HTTP_CODE_200_OK, UniResponse.CODE_OK, null, user.to_string());

  }
  // =========== END OF business logic ===========

  // =========== fixtures and local storage handling ===========
  private _check_user_exists_with_another_id(email: string, id: string, token: string|null|undefined): boolean {
    const user_test = this._get_user_with_email(email);

    // another user exists and it's not our user
    if((user_test != undefined) && (user_test != null) && (!user_test.empty && (user_test.id != id))) {
      return true;
    }

    return false;
  }

  private _check_user_exists(email: string, token: string|null|undefined): boolean {
    const user_test = this._get_user_with_email(email);

    // another user exists and it's not our user
    if((user_test != undefined) && (user_test != null) && (!user_test.empty)) {
      return true;
    }

    return false;
  }

  private _auth_with_token(token: string|null|undefined) {
    return true; // TODO - will be an important thing in non-fake
  }

// ====== registration confirmations =====
private _get_registration_confirmations() {
  const items = this.localStorageService.get_object_from_item("registration_confirmations");
  if ((items != undefined) && (items != null)) {
    return items;
  } else {
    return [];
  }
}

private _set_registration_confirmations(items: []|null) {
  return this.localStorageService.set_item_from_object("registration_confirmations", items);
}

private _get_registration_confirmation_with_email_and_register_confirm_token(email: any, id: any, register_confirm_token: any): any|null {
  for (let item of this._get_registration_confirmations()) {
    if ((item.email == email) && (item.id == id) && (item.register_confirm_token == register_confirm_token)) {
      return item;
    }
  }

  return null;
}

private _add_registration_confirmation(email: string, id: string, register_confirm_token: string) {
  const test_user = this._get_user_with_email(email);
  console.log("==== _add_registration_confirmation-1 " , test_user);
  if ((test_user == undefined) || (test_user == null) || (test_user.empty) || (test_user.status != UserModel.STATUS_NEW)) {
    return;
  }

  const item = {
    "email": email,
    "id": id,
    "register_confirm_token": register_confirm_token,
  };

  console.log("==== _add_registration_confirmation-2 " , item);
  const items = this._get_registration_confirmations();
  for (let test_item of items) {
    if ((test_item.email == email) && (test_item.id == id)) {
      return;
    }
  }

  items.push(item);
  this._set_registration_confirmations(items);
}

private _delete_registration_confirmation(email: string|null|undefined, id: string|null|undefined, register_confirm_token: string|null) {
  const items = this._get_registration_confirmations();
  console.log("==== _delete_registration_confirmation - before: ", items);
  for (let i in items) {
    let test_item = items[i];
    if ((test_item.email == email) && (test_item.id == id) && test_item.register_confirm_token == register_confirm_token) {
      items.splice(i, 1);
      break;
    }
  }

  this._set_registration_confirmations(items);
  console.log("==== _delete_registration_confirmation - after: ", this._get_registration_confirmations());
}
// ====== END OF registration confirmations =====


// ====== password reset requests =====
private _get_password_reset_requests() {
  const items = this.localStorageService.get_object_from_item("password_reset_requests");
  if ((items != undefined) && (items != null)) {
    return items;
  } else {
    return [];
  }
}

private _set_password_reset_requests(items: []|null) {
  return this.localStorageService.set_item_from_object("password_reset_requests", items);
}

private _get_password_reset_request(email: any, id: any, password_reset_token: any): any|null {
  for (let item of this._get_password_reset_requests()) {
    if ((item.email == email) && (item.id == id) && (item.password_reset_token == password_reset_token)) {
      return item;
    }
  }

  return null;
}

private _add_password_reset_request(email: any, id: any, password_reset_token: any) {
  const test_user = this._get_user_with_id_and_email(id, email);
  console.log("==== _add_password_reset_request-1 " , test_user);
  if ((test_user == undefined) || (test_user == null) || (test_user.empty) || (test_user.status != UserModel.STATUS_ACCEPTED)) {
    return;
  }

  const item = {
    "email": email,
    "id": id,
    "password_reset_token": password_reset_token,
  };

  console.log("==== _add_password_reset_request-2 " , item);
  const items = this._get_password_reset_requests();
  for (let i in items) {
    let test_item = items[i];
    if ((test_item.email == email) && (test_item.id == id)) {
      items[i] = item;
      this._set_password_reset_requests(items);
      return;
    }
  }

  items.push(item);
  this._set_password_reset_requests(items);
}

private _delete_password_reset_request(email: string, id: string, password_reset_token: string) {
  const items = this._get_password_reset_requests();
  console.log("==== _delete_password_reset_request - before: ", items);
  for (let i in items) {
    let test_item = items[i];
    if ((test_item.email == email) && (test_item.id == id) && test_item.password_reset_token == password_reset_token) {
      items.splice(i, 1);
      break;
    }
  }

  this._set_password_reset_requests(items);
  console.log("==== _delete_password_reset_request - after: ", this._get_password_reset_requests());
}

// ====== END OF password reset requests =====

// ====== TEST USERS ======
private _get_test_users(): UserModel[] {
  const res_out: UserModel[] = [];
  const items = this.localStorageService.get_object_from_item("test_users");

  if ((items != undefined) && (items != null)) {
    for (let item of items) {
      const item_out = UserModel.from_object(item);
        if ((item_out != undefined) && (item_out != null)) {
          res_out.push(item_out);
        }
      }
    }

    return res_out;
  }

  private _set_test_users(items: UserModel[]|null) {
    return this.localStorageService.set_item_from_object("test_users", items);
  }

  private _fixture_test_users(): UserModel[] {
    // TODO - start using at least local storage for this
    const users = [
      new UserModel("1", "krzychoo@example.com", "12test34", "", UserModel.STATUS_ACCEPTED, null, null),
      new UserModel("2", "krzytest@example.com", "abcd!@#", "", UserModel.STATUS_ACCEPTED, null, null),
      new UserModel("3", "zosia_samosia@example.com", "raNdoMp%s5!@#", "", UserModel.STATUS_ACCEPTED, null, null),
    ];

    return users;
  }

  private _get_user_with_email(email: string): UserModel|null {
    for (let item of this._get_test_users()) {
      if (item.email == email) {
        return item;
      }
    }

    return null;
  }

  private _get_user_with_id_and_email(id: string, email: string): UserModel|null {
    for (let item of this._get_test_users()) {
      if ((item.email == email) && (item.id == id)) {
        return item;
      }
    }

    return null;
  }

  private _get_user_with_email_and_register_confirm_token(email: string, register_confirm_token: string): UserModel|null {
    let found_user = null;
    for (let item of this._get_test_users()) {
      if (item.email == email) {
        found_user = item;
        break;
      }
    }

    if ((found_user == undefined) || (found_user == null)  || (found_user.empty)) {
      return null;
    }

    const confirm = this._get_registration_confirmation_with_email_and_register_confirm_token(found_user.email, found_user.id, register_confirm_token);
    if ((confirm == undefined) || (confirm == null)) {
      return null;
    }

    return found_user;
  }

  private _get_user_with_id(id: string): UserModel|null {
    for (let item of this._get_test_users()) {
      if (item.id == id) {
        return item;
      }
    }

    return null;
  }

  private _get_last_user_id(): number {
    let max_id: number = 0;
    let cur_id: number = 0;

    for (let item of this._get_test_users()) {
      cur_id = parseInt(item.id? item.id: "")
      if (cur_id > max_id) {
        max_id = cur_id;
      }
    }

    return max_id;
  }

  private _add_user(email: string, password: string): [number, string] {
    const last_id: number = this._get_last_user_id();
    const next_id: number = last_id + 1;
    const next_id_str: string = "" + next_id;


    const register_confirm_token = "XX_" + (Math.random() + 1).toString(36).substring(10) +
    "__" + (Math.random() + 1).toString(32).substring(7) + "__" + (Math.random() + 1).toString(36).substring(7) +
    (Math.random() + 76 + Date.now()).toString(36).substring(7) + (Math.random() + 1 +
    Date.now()-666 % 2).toString(19).substring(7) + (Math.random() + 20 * Date.now()- 7 *
    Math.random()).toString(36).substring(7) + (Math.random() + 1).toString(18).substring(9) + "____" +
    (Math.random() + 30 * Date.now()- 18 * Math.random()-55666) + (Math.random() + 30 * Date.now() % 18 * Math.random()-55666);


    const user = UserModel.make_newly_registered_for_fake_auth(next_id_str, email, password);
    this._save_user(user);
    console.log("== _add_user - adding a user: " , user, "next id: ", next_id);

    this._add_registration_confirmation(email, next_id_str, register_confirm_token);

    return [next_id, register_confirm_token];
  }

  private _save_user(user: UserModel) {
    const id = user.id;
    const test_users_tmp = this._get_test_users();
    let user_found = false;

    for (let i in test_users_tmp) {
      if (test_users_tmp[i].id == id) {
        test_users_tmp[i] = user;
        user_found = true;
        break;
      }
    }

    if (!user_found) {
      test_users_tmp.push(user);
    }

    console.log("== _save_user - saving user... users: ", test_users_tmp);

    this._set_test_users(test_users_tmp);
  }
  // ====== END OF TEST USERS ======

  // =========== END OF fixtures and local storage handling ===========

}
