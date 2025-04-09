import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl,  FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UserStateService } from '../_utils/services/user-state-service.service'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  private _bad_login: boolean = false;
  
  
  constructor(
    private router: Router, 
    private userStateService: UserStateService) { 
      this._redirect_out_if_logged_in_obs();
    }
    
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  _redirect_out_if_logged_in_obs() {
    const obs = this.userStateService.is_logged_sub();
    obs.subscribe(is_logged => {
      console.log("==== subscriber to is_logged_obs: ", is_logged);
      if (is_logged) {
        this.router.navigateByUrl("/home");
      }
    });
  }


  _redirect_out_if_logged_in(is_logged: boolean, show_bad_login: boolean) {
  }
    
  submit_form() {
    console.log("Submit login form!", this.form.value);

    const res = this.userStateService.log_in(this.form.controls['email'].value,
      this.form.controls['password'].value);
    res.subscribe(data => {
      console.log("DATA DATA ", data);
      this._bad_login = (data == 'LOGIN_ERROR')
    });
  }
    
  get bad_login() {
    return this._bad_login;
  }

  reset_pass() { 
    console.log("reset pass click");
    this.router.navigateByUrl("/reset-password")
  }

  // @Input() login_error?: string|null;
  @Output() submitEmitter = new EventEmitter();
}
