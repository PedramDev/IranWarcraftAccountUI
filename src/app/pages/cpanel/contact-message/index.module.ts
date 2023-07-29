import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppContactMessageListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppContactMessageComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

const ROUTES: Routes = [
    { path: "", component: AppContactMessageListComponent },
    { path: ':id', component: AppContactMessageComponent }
];

@NgModule({
    declarations: [AppContactMessageListComponent,AppContactMessageComponent],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppContactMessageModule { }
