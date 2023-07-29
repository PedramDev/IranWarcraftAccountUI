import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppProductListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppProductComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

const ROUTES: Routes = [
    { path: "", component: AppProductListComponent },
    { path: ':id', component: AppProductComponent }
];

@NgModule({
    declarations: [AppProductListComponent,AppProductComponent],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppProductModule { }
