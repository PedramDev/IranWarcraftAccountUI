import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppTicketListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppTicketComponent } from "./edit/edit.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

const ROUTES: Routes = [
    { path: "", component: AppTicketListComponent },
    { path: ':ticketId', component: AppTicketComponent },
    { path: 'add', component: AppTicketComponent }
];

@NgModule({
    declarations: [AppTicketListComponent,AppTicketComponent],
    imports: [
        CKEditorModule,
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppTicketModule { }
