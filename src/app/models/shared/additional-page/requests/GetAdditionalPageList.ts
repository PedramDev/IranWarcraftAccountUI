import { GetListRequest, PageStatus } from "src/app/models/shared-models";

export class GetAdditionalPageList extends GetListRequest {
    status: PageStatus | null;
}
