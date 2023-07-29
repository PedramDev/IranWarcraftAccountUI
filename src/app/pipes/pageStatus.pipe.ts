import { Pipe, PipeTransform } from '@angular/core';
import { PageStatus } from '../models/shared-models/Enums/PageStatus';

@Pipe({name: 'pageStatus', pure: false})
export class PageStatusPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case PageStatus.Published.toLowerCase():
        name = 'انتشار';
        break;
      case PageStatus.Draft.toLowerCase():
        name = 'ذخیره';
        break;
    }
    return name;
  }
}
