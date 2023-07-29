import { NgModule } from '@angular/core';
import { ArticleCommentStatusPipe } from './articleCommentStatus.pipe';
import { ArticleCategoryOrderingPipe } from './articleCategoryOrdering.pipe';
import { ArticleTypePipe } from './articleType.pipe';

import { CommentStatusPipe } from './commentStatus.pipe';

import { LicenseStatusPipe } from './licenseStatus.pipe';
import { PageStatusPipe } from './pageStatus.pipe';

import { TicketStatusPipe } from './ticketStatus.pipe';

  @NgModule({
    imports: [],
    declarations: [
      ArticleCommentStatusPipe,
      ArticleCategoryOrderingPipe,
      ArticleTypePipe,

      CommentStatusPipe,

      LicenseStatusPipe,
      PageStatusPipe,
      
      TicketStatusPipe,
    ],
    providers: [],
    exports: [
      ArticleCommentStatusPipe,
      ArticleCategoryOrderingPipe,
      ArticleTypePipe,

      CommentStatusPipe,

      LicenseStatusPipe,
      PageStatusPipe,

      TicketStatusPipe,
    ],
  })
  export class PipesModule {}
  