import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppSystemSettingComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

const ROUTES: Routes = [
    { path: "", component: AppSystemSettingComponent },
];

@NgModule({
    declarations: [AppSystemSettingComponent],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppSystemSettingModule { }
