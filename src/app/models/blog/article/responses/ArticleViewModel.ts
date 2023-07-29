import { ArticleType } from "../enums/ArticleType";
import { ArticleCommentStatus } from "../enums/ArticleCommentStatus";
import { TagViewModel } from "../../tag";
import { CommentViewModel } from "../../comment";
import { WebPageViewModel } from "../../../shared-models/WebPageViewModel";
import { MediaViewModel } from "src/app/models/media";
import { PageStatus } from "src/app/models/shared-models";

export class ArticleViewModel {
    id: number;
    content: string;
    excerpt: string;
    status: PageStatus;
    commentStatus: ArticleCommentStatus;
    type: ArticleType;
    categoryId: number | null;
    tags: TagViewModel[];
    comments: CommentViewModel[];
    webPage: WebPageViewModel;
    image?: MediaViewModel;
}
