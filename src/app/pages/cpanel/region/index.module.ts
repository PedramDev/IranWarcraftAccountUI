import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRegionListComponent } from "./list/list.component";
import { ShareModule } from "src/app/share.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRegionComponent } from "./edit/edit.component";

const ROUTES: Routes = [
    { path: "", component: AppRegionListComponent },
    { path: 'add', component: AppRegionComponent },
    { path: ':id', component: AppRegionComponent }
];

@NgModule({
    declarations: [AppRegionListComponent,AppRegionComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule]
})
export class AppRegionModule { }
