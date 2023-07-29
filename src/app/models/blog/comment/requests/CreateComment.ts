import { CommentStatus } from "../enums/CommentStatus";

export class CreateComment {
    status: CommentStatus;
    firstName: string;
    lastName: string;
    content: string;
    iP: string;
    email: string;
    parentId: string | null;
    articleId: number;
    userId: number | null;
}
