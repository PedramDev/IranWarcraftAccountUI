import { CommentStatus } from "../enums/CommentStatus";
import { ArticleViewModel } from "../../article/responses/ArticleViewModel";
import { UserViewModel } from "../../../user/viewmodels/UserViewModel";

export class CommentViewModel {
    id:number;
    createdAt: string;
    modifiedAt: string | null;
    status: CommentStatus;
    firstName: string;
    lastName: string;
    content: string;
    iP: string;
    email: string;
    parentId: string | null;
    articleId: number;
    userId: number | null;
    article: ArticleViewModel;
    user: UserViewModel;
}
