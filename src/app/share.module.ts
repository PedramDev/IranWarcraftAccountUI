import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
// import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { PipesModule } from './pipes/pipes.module';

const ngZorroModules = [
  NzPaginationModule,
  NzPageHeaderModule,
  NzSwitchModule,
  NzLayoutModule,
  NzInputNumberModule,
  NzDropDownModule,
  NzSliderModule,
  NzTimePickerModule,
  NzTableModule,
  NzDividerModule,
  NzInputModule,
  NzIconModule,
  NzModalModule,
  NzToolTipModule,
  NzGridModule,
  NzSelectModule,
  NzButtonModule,
  NzMenuModule,
  NzPopoverModule,
  NzAffixModule,
  NzAnchorModule,
  NzAvatarModule,
  NzCardModule,
  NzCheckboxModule,
  NzTreeSelectModule,
  // NzCodeEditorModule,
  NzFormModule,
  NzUploadModule,
  NzSkeletonModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PipesModule,
    ...ngZorroModules
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PipesModule,
    ...ngZorroModules
  ]
})
export class ShareModule {}