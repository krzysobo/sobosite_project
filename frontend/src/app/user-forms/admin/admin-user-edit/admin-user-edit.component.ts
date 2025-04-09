import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../_utils/services/admin/admin.service';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, 
  AbstractControl, ValidationErrors } from '@angular/forms'

  import { PasswordsMatchValidator } from '../../_utils/validators/PasswordsMatchValidator'
  import { UniResponse } from '../../_utils/http/uniresponse';
  import { ResponseUtils } from '../../_utils/http/responses';
  // import { MatCardModule } from '@angular/material/card'
  // import { MatCheckboxModule } from '@angular/material/checkbox'
  // import { MatInputModule } from '@angular/material/input'
  // import { MatButtonModule } from '@angular/material/button'
  // import { CommonModule } from '@angular/common'
  // import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-admin-user-edit',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, MatCheckboxModule, 
  //   FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-user-edit.component.html',
  styleUrl: './admin-user-edit.component.scss'
})
export class AdminUserEditComponent implements OnInit, OnDestroy {
  private _sub: any;
  private _user_id: string|null = null;
  private _res_loaded: number = 0;
  private _res_update: number = 0;
  private _res_create: number = 0;
  private _is_password_change_open: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),

    is_active: new FormControl(false),
    is_staff: new FormControl(false),
    failed_is_blocked: new FormControl(false),
    
    password_1: new FormControl(''),
    password_2: new FormControl(''),

  }, {validators: PasswordsMatchValidator });


  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private adminService: AdminService) { }

  ngOnInit() {
    this._sub = this.route.params.subscribe(params => {
        this._user_id = params['id']; 
        console.log("ADMIN_USER_EDIT -- USER ID ", this._user_id);

        if ((this._user_id != undefined) && (this._user_id != null) && (this._user_id != "")) {
          this._is_password_change_open = false;
          this.adminService.admin_user_get(this._user_id).subscribe({ 
              next: (resp: any) => {
                console.log("AdminUserEditComponent - get - data: ", resp);
                this.form.controls['email'].setValue(resp.body.email);
                this.form.controls['first_name'].setValue(resp.body.first_name);
                this.form.controls['last_name'].setValue(resp.body.last_name);
                this.form.controls['is_active'].setValue(resp.body.is_active);
                this.form.controls['is_staff'].setValue(resp.body.is_staff);
                this.form.controls['failed_is_blocked'].setValue(resp.body.failed_is_blocked);

                
              }, 
              error: (resp: any) => {

              },
              complete: () => {}
        });

        } else {
          // new user   
          this._is_password_change_open = true;
        }
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  _get_userdata_from_form() {
    const res: any = {
      'email': this.form.controls['email'].value,
      'first_name': this.form.controls['first_name'].value,
      'last_name': this.form.controls['last_name'].value,
      'is_active': this.form.controls['is_active'].value,
      'is_staff': this.form.controls['is_staff'].value,
      'failed_is_blocked': this.form.controls['failed_is_blocked'].value,
    }

    if ((this.form.controls['password_1'].value != undefined) &&  (this.form.controls['password_1'].value != null) && 
        (this.form.controls['password_1'].value != "")) {
      res['password'] = this.form.controls['password_1'].value;
    }
    return res;
  }

  _submit_form_update(user_id: string) {
    console.log("AdminUserEditComponent - USER exists, id: ", this._user_id, " -- updating.");

    this.adminService.admin_user_update(
      user_id,
      this.form.value
    ).subscribe({
      next: (resp) => {
        console.log("=== AdminUserEditComponent - update - data ", resp);
        this._res_update = UniResponse.CODE_OK;
      },
      error: (resp) => {
        console.log("=== AdminUserEditComponent - update ERROR - data ", resp);
        if (ResponseUtils.resp_error_email_already_taken(resp)) {
          this._res_update = UniResponse.CODE_ALREADY_EXISTS;
        } else {
          this._res_update = UniResponse.CODE_FAILED;
        }
      },
      complete: () => {}
    });
  }

  _submit_form_create() {
    console.log("AdminUserEditComponent - NEW USER -- creating");

    this.adminService.admin_user_create(
      this._get_userdata_from_form()
    ).subscribe({
      next: (resp) => {
        console.log("=== AdminUserEditComponent - create - data ", resp);
        this._res_create = UniResponse.CODE_OK;
      },
      error: (resp) => {
        console.log("=== AdminUserEditComponent - create ERROR - data ", resp);
        if (ResponseUtils.resp_error_email_already_taken(resp)) {
          this._res_create = UniResponse.CODE_ALREADY_EXISTS;
        } else {
          this._res_create = UniResponse.CODE_FAILED;
        }
      },
      complete: () => {}
    });
  }

  submit_form() {
    console.log("AdminUserEditComponent - Submit admin user edit form!", this.form.value);

    if (this._user_id) {
      this._submit_form_update(this._user_id);
    } else {
      this._submit_form_create();
    }

    // this.submitEmitter.emit(this.form.value);
  }

  get is_new_user() {
    return ((this._user_id == undefined) || (this._user_id == null) || (this._user_id == ''));
  }

  get is_email_already_taken() {
    return (((!this.is_new_user) && (this._res_update == UniResponse.CODE_ALREADY_EXISTS)) ||
        ((this.is_new_user) && (this._res_create == UniResponse.CODE_ALREADY_EXISTS)));
  }

  get is_other_error() {
    return (((!this.is_new_user) && (this._res_update == UniResponse.CODE_FAILED)) ||
        ((this.is_new_user) && (this._res_create == UniResponse.CODE_FAILED)));
  }

  get is_user_updated_ok() {
    return (!this.is_new_user) && (this._res_update == UniResponse.CODE_OK);
  }

  get is_user_created_ok() {
    return (this.is_new_user) && (this._res_update == UniResponse.CODE_OK);
  }

  edit_mode_toggle_password_change() {
    this._is_password_change_open = !this._is_password_change_open;
  }

  get is_password_change_open() {
    return this._is_password_change_open;
  }
}
