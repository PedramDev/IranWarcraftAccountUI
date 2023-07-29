import { Pipe, PipeTransform } from '@angular/core';
import { ArticleType } from '../models/blog/article/enums/ArticleType';

@Pipe({name: 'articleType', pure: false})
export class ArticleTypePipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case ArticleType.Content.toLowerCase():
        name = 'محتوا';
        break;
    }
    return name;
  }
}
