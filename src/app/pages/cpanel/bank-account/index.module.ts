import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppBankAccountListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppBankAccountComponent } from "./edit/edit.component";

const ROUTES: Routes = [
    { path: "", component: AppBankAccountListComponent },
    { path: 'add', component: AppBankAccountComponent },
    { path: ':id', component: AppBankAccountComponent }
];

@NgModule({
    declarations: [AppBankAccountListComponent,AppBankAccountComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppBankAccountModule { }
