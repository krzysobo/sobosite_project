import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button'
import { UserStateService } from './user-forms/_utils/services/user-state-service.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";

import { SoboCommonModule } from './sobo-common/sobo-common.module';
import { UserFormsModule } from './user-forms/user-forms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,  RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, UserFormsModule,
    MatCardModule, MatInputModule,  FormsModule, ReactiveFormsModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private userStateService: UserStateService, private router: Router) {

  }

  get is_user_logged() {
    return this.userStateService.is_logged();
  }

  get is_user_logged_and_admin() {
    return this.userStateService.is_logged_and_admin();
  }

  log_out() {
    this.userStateService.log_out().subscribe(data => {
      console.log("==== log_out data ", data);
      this.router.navigateByUrl("/home");
    });
  }

  title = 'frontend';
}
