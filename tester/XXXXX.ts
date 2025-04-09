import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { UserFormsModule } from "./user-forms/user-forms.module";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        UserFormsModule,
        RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, CommonModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [AppComponent]
})
export class AppModule{ }

// console.log("APP MODULE LOADED!");