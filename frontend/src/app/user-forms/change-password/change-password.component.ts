import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { Router } from '@angular/router'
import { PasswordsMatchValidator } from '../_utils/validators/PasswordsMatchValidator'
import { UserStateService } from '../_utils/services/user-state-service.service'
import { UniResponse } from '../_utils/http/uniresponse'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-change-password',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private _res_update: number = 0;
  constructor(private router: Router, private userStateService: UserStateService) { }
  
  form: FormGroup = new FormGroup({  
    password_current: new FormControl(''),
    password_1: new FormControl(''),
    password_2: new FormControl(''),
  }, {validators: PasswordsMatchValidator });

  submit_form() {
    console.log("Submit change password  - password change form!", this.form.value);
    this.userStateService.update_password(
      this.form.controls['password_current'].value, this.form.controls['password_1'].value).subscribe(data => {
        console.log("change-password component, update_password: ", data);
        if (data == "PASSWORD_CHANGE_OK") {
          this._res_update = UniResponse.CODE_OK;
        }else if (data == "PASSWORD_CHANGE_ERROR") {
          this._res_update = UniResponse.CODE_FAILED;
        }
      });
    // this.submitEmitter.emit(this.form.value);

  }

  reset() {
    console.log("Reset form data");
    this.form.reset();
  }

  get is_password_updated_ok() {
    return (this._res_update == UniResponse.CODE_OK);
  }

  get is_network_error() {
    return ((this._res_update == UniResponse.CODE_UNAUTHORIZED) || 
      (this._res_update == UniResponse.CODE_NETWORK_ERROR) || (this._res_update == UniResponse.CODE_NOT_FOUND));
  }

  get is_current_password_error() {
    return (this._res_update == UniResponse.CODE_FAILED);
  }

  @Output() submitEmitter = new EventEmitter();
}
