import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTagListComponent } from './list/list.component';
import { ShareModule } from 'src/app/share.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTagComponent } from './edit/edit.component';

const ROUTES: Routes = [
    { path: '', component: AppTagListComponent },
    { path: ':id', component: AppTagComponent },
];

@NgModule({
    declarations: [AppTagListComponent, AppTagComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ShareModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule],
})
export class AppTagModule { }
