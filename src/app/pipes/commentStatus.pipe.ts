import { Pipe, PipeTransform } from '@angular/core';
import { CommentStatus } from '../models/blog/comment/enums/CommentStatus';

@Pipe({name: 'commentStatus', pure: false})
export class CommentStatusPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case CommentStatus.Published.toLowerCase():
        name = 'انتشار';
        break;
      case CommentStatus.Pending.toLowerCase():
        name = 'درانتظار بررسی';
        break;
        case CommentStatus.Rejected.toLowerCase():
          name = 'رد شد';
          break;
    }
    return name;
  }
}
