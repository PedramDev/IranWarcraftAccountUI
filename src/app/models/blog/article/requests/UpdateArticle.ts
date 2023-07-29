import { ArticleType } from "../enums/ArticleType";
import { ArticleCommentStatus } from "../enums/ArticleCommentStatus";
import { PageStatus } from "src/app/models/shared-models";

export class UpdateArticle {
    id: number;
    content: string;
    excerpt: string;
    status: PageStatus;
    commentStatus: ArticleCommentStatus;
    type: ArticleType;
    categoryId: number | null;
    title: string;
    description: string;
    slug: string;
    tags: number[];
    genres: number[];
}
