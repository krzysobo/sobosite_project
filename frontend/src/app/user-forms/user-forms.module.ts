import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { RegisterConfirmationComponent } from "./register-confirmation/register-confirmation.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ResetPasswordConfirmComponent } from "./reset-password-confirm/reset-password-confirm.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { AdminUserEditComponent } from "./admin/admin-user-edit/admin-user-edit.component";
import { AdminUserListComponent } from "./admin/admin-user-list/admin-user-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { DeleteUserDialog } from "./admin/admin-user-list/dialogs/delete-user-dialog";
// import { HttpClient, HttpHandler } from "@angular/common/http";

@NgModule({
    imports: [
        CommonModule,
        MatCardModule, MatInputModule, MatButtonModule, MatCheckboxModule, 
            FormsModule, ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive,
          MatFormFieldModule, 
            MatTableModule, 
            MatSortModule, MatPaginatorModule, MatDialogModule,
    ],

    declarations: [
        AdminUserEditComponent,
        AdminUserListComponent,
        ChangePasswordComponent, 
        LoginComponent,
        ProfileComponent,
        RegisterComponent,
        RegisterConfirmationComponent,
        ResetPasswordComponent,
        ResetPasswordConfirmComponent,
        DeleteUserDialog,

    ],
    providers: [
        MatDialog
    ],

    exports: [

    ]
})
export class UserFormsModule { }