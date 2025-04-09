import { Routes } from '@angular/router';

import { MainComponent } from './sobosite/main/main.component';
import { PrivacyPolicyComponent } from './sobosite/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './sobosite/about-us/about-us.component';
import { CookiesComponent } from './sobosite/cookies/cookies.component';

import { LoginComponent } from './user-forms/login/login.component';
import { RegisterComponent } from './user-forms/register/register.component';
import { ProfileComponent } from './user-forms/profile/profile.component';
import { ResetPasswordComponent } from './user-forms/reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './user-forms/reset-password-confirm/reset-password-confirm.component';
import { ChangePasswordComponent } from './user-forms/change-password/change-password.component';
import { AuthGuardService } from './user-forms/_utils/services/auth-guard.service';
import { RegisterConfirmationComponent } from './user-forms/register-confirmation/register-confirmation.component';
import { AdminUserListComponent } from './user-forms/admin/admin-user-list/admin-user-list.component';
import { AdminUserEditComponent } from './user-forms/admin/admin-user-edit/admin-user-edit.component';


export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'home', component: MainComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'cookies', component: CookiesComponent},

    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'register/confirm/:email/:register_confirm_token', component: RegisterConfirmationComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'reset-password/confirm/:email/:password_reset_token', component: ResetPasswordConfirmComponent},
    
    {path: 'profile', component: ProfileComponent,        
        canActivate: [AuthGuardService], 
        canActivateChild: [AuthGuardService]},
    {path: 'profile/change-password', component: ChangePasswordComponent,
        canActivate: [AuthGuardService], 
        canActivateChild: [AuthGuardService]},

    {path: 'admin/users', component: AdminUserListComponent,
        canActivate: [AuthGuardService], 
        canActivateChild: [AuthGuardService]},
    {path: 'admin/user/edit/create', component: AdminUserEditComponent,
        canActivate: [AuthGuardService], 
        canActivateChild: [AuthGuardService]},
    {path: 'admin/user/edit/:id', component: AdminUserEditComponent,
        canActivate: [AuthGuardService], 
        canActivateChild: [AuthGuardService]},

    
];
