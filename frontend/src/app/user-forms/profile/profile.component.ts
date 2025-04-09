import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
import { Router } from '@angular/router'
import { UserModel } from '../_models/UserModel'
import { UserStateService } from '../_utils/services/user-state-service.service'
import { UniResponse } from '../_utils/http/uniresponse'

// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { PasswordsMatchValidator } from '../_utils/validators/PasswordsMatchValidator'


@Component({
  selector: 'app-profile',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, 
  //   CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  _profile: UserModel|null
  _res_update : number

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
  }, {});

  constructor(
      private router: Router, 
      private userStateService: UserStateService) { 
    this._profile = this.userStateService.get_current_user();
    console.log("PROFILE COMPONENT - THIS PROFILE ", this._profile);
    this.form.controls['email'].setValue(this._profile?.email);
    this.form.controls['first_name'].setValue(this._profile?.first_name);
    this.form.controls['last_name'].setValue(this._profile?.last_name);
    this._res_update = 0;
  }


  submit_form() {
    console.log("Submit profile form!", this.form.value);

    this.userStateService.update_profile(
      this.form.controls['email'].value, 
      this.form.controls['first_name'].value, 
      this.form.controls['last_name'].value
    ).subscribe(data => {
      console.log("=== profile component - update_profile - data ", data);
      if (data == 'PROFILE_UPDATE_OK') {
        this._res_update = UniResponse.CODE_OK;
      } else if (data == 'PROFILE_UPDATE_ERROR_ALREADY_EXISTS') {
        this._res_update = UniResponse.CODE_ALREADY_EXISTS;
      } else if (data == 'PROFILE_UPDATE_ERROR') {
        this._res_update = UniResponse.CODE_FAILED;
      }
    });

    // this.submitEmitter.emit(this.form.value);
  }

  change_pass() {
    console.log("Change profile password");
    this.router.navigateByUrl("/change-password")
  }

  get is_email_already_taken() {
    return (this._res_update == UniResponse.CODE_ALREADY_EXISTS);
  }

  get is_profile_updated_ok() {
    return (this._res_update == UniResponse.CODE_OK);
  }

  get is_network_error() {
    return ((this._res_update == UniResponse.CODE_UNAUTHORIZED) || (this._res_update == UniResponse.CODE_NOT_FOUND) || 
      (this._res_update == UniResponse.CODE_NETWORK_ERROR));
  }

  @Output() submitEmitter = new EventEmitter();

}
