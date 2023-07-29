import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLicenseListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppLicenseComponent } from "./edit/edit.component";

const ROUTES: Routes = [
    { path: "", component: AppLicenseListComponent },
    { path: 'add', component: AppLicenseComponent },
    { path: ':id', component: AppLicenseComponent }
];

@NgModule({
    declarations: [AppLicenseListComponent,AppLicenseComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppLicenseModule { }
