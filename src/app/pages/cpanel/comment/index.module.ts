import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppCommentListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppCommentComponent } from "./edit/edit.component";

const ROUTES: Routes = [
    { path: "", component: AppCommentListComponent },
    { path: 'add', component: AppCommentComponent },
    { path: ':id', component: AppCommentComponent }
];

@NgModule({
    declarations: [AppCommentListComponent,AppCommentComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppCommentModule { }
