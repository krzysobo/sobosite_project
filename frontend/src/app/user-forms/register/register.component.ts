import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { PasswordsMatchValidator } from '../_utils/validators/PasswordsMatchValidator'
import { UserStateService } from '../_utils/services/user-state-service.service'
import { UniResponse } from '../_utils/http/uniresponse'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-register',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, 
  //   CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _res_registered: number = 0;
  private _fake_mode_register_confirm_token: string|null|undefined = "";
  private _email: string = "";

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    password_1: new FormControl(''),
    password_2: new FormControl(''),
  }, {validators: PasswordsMatchValidator });

  constructor(private router: Router, private userStateService: UserStateService) { 
  }

  submit_form() {
    console.log("Submit registration form!", this.form.value);

    this.userStateService.register(
      this.form.controls['email'].value,
      this.form.controls['password_1'].value, 
      this.form.controls['first_name'].value,
      this.form.controls['last_name'].value
    ).subscribe(data => {
      console.log("==== RegisterComponent - register - data", data);
      if (data == 'REGISTER_OK') {
        this._res_registered = UniResponse.CODE_OK;
      }else if (data == 'REGISTER_ERROR_ALREADY_EXISTS') {
        this._res_registered = UniResponse.CODE_ALREADY_EXISTS;
      }else if (data == 'REGISTER_ERROR') {
        this._res_registered = UniResponse.CODE_FAILED;
      }
      
    });
    
    this._email = this.form.controls['email'].value;
    // if (this._res_registered == UniResponse.CODE_OK) {

    //   // if (this.is_fake_mode) {
    //   //   this._fake_mode_register_confirm_token = resp.data_text;
    //   // }
    // }
  }

  reset() {
    console.log("Reset registration form data");
    this.form.reset();
  }

  get is_email_already_taken() {
    return (this._res_registered == UniResponse.CODE_ALREADY_EXISTS);
  }

  get is_registered_ok() {
    return (this._res_registered == UniResponse.CODE_OK);
  }

  get is_fake_mode() {
    return this.userStateService.is_fake_mode;
  }

  get registered_email() {
    return this._email;
  }

  get fake_mode_register_confirm_url(): string {
    if (this.is_fake_mode) {
      return "/register/confirm/" + this._email + "/" + this._fake_mode_register_confirm_token;
    }

    return "";
  }


  @Output() submitEmitter = new EventEmitter();

}
