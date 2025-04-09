import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStateService } from '../_utils/services/user-state-service.service';
import { UniResponse } from '../_utils/http/uniresponse'
// import { FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'
// import { MatCardModule } from '@angular/material/card'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-register-confirmation',
  standalone: false,
  // imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-confirmation.component.html',
  styleUrl: './register-confirmation.component.scss'
})
export class RegisterConfirmationComponent implements OnInit, OnDestroy {
  private _email: string|null = null; 
  private _register_confirm_token: string|null = null;
  private _wrong_data: boolean = false;
  private _res_confirm: number = 0;
  private _sub: any;

  constructor(private router: Router, 
      private route: ActivatedRoute, 
      private userStateService: UserStateService) { }

  ngOnInit() {
    this._sub = this.route.params.subscribe(params => {
       this._email = params['email']; 
       this._register_confirm_token = params['register_confirm_token'];

       if ((this._email != undefined) && (this._email != null) && (this._email != "") && 
            (this._register_confirm_token != undefined) && (this._register_confirm_token != null) && 
              (this._register_confirm_token != "")) {
         this.userStateService.confirm_registration(this._email, this._register_confirm_token).subscribe(data => {
            console.log("RegisterConfirmationComponent - confirm_registration - data: ", data);
            if (data=='REGISTER_CONFIRM_OK') {
              this._res_confirm = UniResponse.CODE_OK;
            } else {
              this._res_confirm = UniResponse.CODE_FAILED;
            }
         });
       } else {
          this._wrong_data = true;
       }

       console.log("EMAIL ", this._email, "register_confirm_token ", this._register_confirm_token, 
          "res_confirm ", this._res_confirm, " wrong data? ", this._wrong_data);
    });
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

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
