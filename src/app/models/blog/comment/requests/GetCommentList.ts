import { GetListRequest } from "src/app/models/shared-models";
import { CommentStatus } from "../enums/CommentStatus";
export class GetCommentList extends GetListRequest {
    status: CommentStatus | null;
}
