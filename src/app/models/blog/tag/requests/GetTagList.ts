import { GetListRequest, PageStatus } from "src/app/models/shared-models";

export class GetTagList extends GetListRequest {
    status ?: PageStatus
}
