import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppArticleListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppArticleComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { PageStatusPipe } from "src/app/pipes/pageStatus.pipe";
import { ArticleTypePipe } from "src/app/pipes/articleType.pipe";
import { CommentStatusPipe } from "src/app/pipes/commentStatus.pipe";

const ROUTES: Routes = [
    { path: "", component: AppArticleListComponent },
    { path: ':id', component: AppArticleComponent }
];

@NgModule({
    declarations: [
        AppArticleListComponent,
        AppArticleComponent
    ],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppArticleModule { }
