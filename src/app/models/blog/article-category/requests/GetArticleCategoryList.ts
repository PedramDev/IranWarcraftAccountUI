import { PageStatus } from "src/app/models/shared-models";
import { ArticleCategoryOrdering } from "..";
import { GetListRequest } from "../../../shared-models/GetListRequest";

export class GetArticleCategoryList extends GetListRequest {
    status ?: PageStatus
    orderBy ?: ArticleCategoryOrdering
}
