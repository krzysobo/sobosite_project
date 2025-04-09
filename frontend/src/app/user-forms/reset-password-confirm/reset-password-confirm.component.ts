import { Component, Input, Output, EventEmitter, NgModule, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PasswordsMatchValidator } from '../_utils/validators/PasswordsMatchValidator'
import { UserStateService } from '../_utils/services/user-state-service.service'
import { UniResponse } from '../_utils/http/uniresponse'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-reset-password-confirm',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.scss'
})
export class ResetPasswordConfirmComponent implements OnInit, OnDestroy{
  private _email: string|null = null; 
  private _password_reset_token: string|null = null;
  private _wrong_data: boolean = false;
  private _res_confirm: number = 0;
  private _sub: any;

  constructor(private router: Router, 
      private route: ActivatedRoute, 
      private userStateService: UserStateService) { }

  ngOnInit() {
    this._sub = this.route.params.subscribe(params => {
       this._email = params['email']; 
       this._password_reset_token = params['password_reset_token'];
       console.log("EMAIL ", this._email, "password reset token ", this._password_reset_token);
    });
  }



  form: FormGroup = new FormGroup({
    password_1: new FormControl(''),
    password_2: new FormControl(''),
  }, {validators: PasswordsMatchValidator });

  submit_form() {
    console.log("Submit reset password  - password change form!", this.form.value);
    if ((this._email != undefined) && (this._email != null) && (this._email != "") && 
        (this._password_reset_token != undefined) && (this._password_reset_token != null) && 
          (this._password_reset_token != "")) {
      this.userStateService.confirm_password_reset(
          this._email, this._password_reset_token, this.form.controls['password_1'].value).subscribe(data => {
            console.log("ResetPasswordConfirmComponent - confirm_password_reset - data: ", data);
            if (data == "RESET_PASSWORD_CONFIRM_OK") {
              this._res_confirm = UniResponse.CODE_OK;
            } else if (data == "RESET_PASSWORD_CONFIRM_ERROR") {
              this._res_confirm = UniResponse.CODE_FAILED;
            }
          });
    } else {
      this._wrong_data = true;
    }

    console.log("EMAIL ", this._email, "password_reset_token ", this._password_reset_token, 
      "res_confirm ", this._res_confirm, " wrong data? ", this._wrong_data);
  }

  reset() {
    console.log("Reset form data");
    this.form.reset();
  }

  get email() {
    return this._email;
  }

  get wrong_data() {
    return this._wrong_data;
  }

  get confirm_ok() {
    return (this._res_confirm == UniResponse.CODE_OK);
  }

  get confirm_failed() {
    return (this._res_confirm == UniResponse.CODE_FAILED);
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }


  @Output() submitEmitter = new EventEmitter();

}
