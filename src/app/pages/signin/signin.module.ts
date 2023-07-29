import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { AppSigninComponent } from "./signin.component";

const ROUTES: Routes = [
    { path: "", component: AppSigninComponent }
];

@NgModule({
    declarations: [AppSigninComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(ROUTES),
        NzInputNumberModule,
        NzInputModule,
        NzButtonModule,
        NzFormModule,
        FormsModule,
    ]
})
export class AppSigninModule { }
