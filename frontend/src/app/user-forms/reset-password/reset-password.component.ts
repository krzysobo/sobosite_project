import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UserStateService } from '../_utils/services/user-state-service.service'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'
// import { RouterLink } from '@angular/router';
// import { UniResponse } from '../_utils/http/uniresponse'


@Component({
  selector: 'app-reset-password',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, RouterLink],

  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private _res_send_reset_request_is_ok: boolean = false;
  private _fake_mode_password_reset_token: string|null|undefined = "";
  private _email: string = "";

  constructor(
    private router: Router, 
    private userStateService: UserStateService) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  submit_form() {
    console.log("Submit reset password  form!", this.form.value);

    this.userStateService.send_reset_password_request(this.form.controls['email'].value).subscribe(data => {
      console.log("==== ResetPasswordComponent - send_reset_password_request - data: ", data);
      if (data == 'RESET_PASSWORD_SEND_OK') {
        this._res_send_reset_request_is_ok = true;
      } else {
        this._res_send_reset_request_is_ok = true;
      }
    });
    

    console.log("_res_send_reset_request_is_ok ")
  }

  get is_reset_request_sent_ok() {
    return this._res_send_reset_request_is_ok;
  }

  get is_fake_mode() {
    return this.userStateService.is_fake_mode;
  }

  get email() {
    return this._email;
  }

  get fake_mode_password_reset_confirm_url(): string {
    if (this.is_fake_mode) {
      return "/reset-password/confirm/" + this._email + "/" + this._fake_mode_password_reset_token;
    }

    return "";
  }

  
  @Output() submitEmitter = new EventEmitter();

}


