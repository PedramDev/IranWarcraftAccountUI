import { PageStatus } from "src/app/models/shared-models";
import { GetListRequest } from "../../../shared-models/GetListRequest";

export class GetProductCategoryList extends GetListRequest {
    status: PageStatus | null;
    productCategoryId: number | null;
}
