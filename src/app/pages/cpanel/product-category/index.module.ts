import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppProductCategoryListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppProductCategoryComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

const ROUTES: Routes = [
    { path: "", component: AppProductCategoryListComponent },
    { path: ':id', component: AppProductCategoryComponent }
];

@NgModule({
    declarations: [AppProductCategoryListComponent,AppProductCategoryComponent],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppProductCategoryModule { }
