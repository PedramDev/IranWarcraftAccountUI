import { GetListRequest, PageStatus } from "src/app/models/shared-models";
export class GetArticleList extends GetListRequest {
    status: PageStatus | null;
    categoryId: number | null;
    tagId: number | null;
}