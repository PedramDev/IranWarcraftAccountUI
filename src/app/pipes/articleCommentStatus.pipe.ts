// ArticleCommentStatus

import { Pipe, PipeTransform } from '@angular/core';
import { ArticleCommentStatus } from 'src/app/models/blog/article/enums/ArticleCommentStatus';

@Pipe({name: 'articleCommentStatus', pure: false})
export class ArticleCommentStatusPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case ArticleCommentStatus.Avaiable.toLowerCase():
        name = 'فعال';
        break;
      case ArticleCommentStatus.Unavaiable.toLowerCase():
        name = 'غیرفعال';
        break;
    }
    return name;
  }
}
