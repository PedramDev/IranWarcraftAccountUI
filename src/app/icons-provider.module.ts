import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import * as icon from '@ant-design/icons-angular/icons';

const icons = [
  icon.LockOutline,
  icon.FormOutline,
  icon.EditOutline,
  icon.DeleteOutline,
  icon.UserOutline,
  icon.PlusOutline
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {
}
