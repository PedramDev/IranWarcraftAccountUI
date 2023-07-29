import { Pipe, PipeTransform } from '@angular/core';
import { ArticleCategoryOrdering } from 'src/app/models/blog/article-category/enums/ArticleCategoryOrdering';

@Pipe({name: 'articleCategoryOrdering', pure: false})
export class ArticleCategoryOrderingPipe implements PipeTransform {
  transform(status: string | null): string {
    if (status == null || status == undefined) {
      return '';
    }
    let name = '';

    switch (status.toLowerCase()) {
      case ArticleCategoryOrdering.ByArticleCount.toLowerCase():
        name = 'تعداد نوشته';
        break;
    }
    return name;
  }
}
