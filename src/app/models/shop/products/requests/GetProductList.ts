import { PageStatus, SellToUsStatus } from "src/app/models/shared-models";
import { GetListRequest } from "../../../shared-models/GetListRequest";


export class GetProductList extends GetListRequest {
    categoryId: number | null;
    status: PageStatus | null;
    sellToUsStatus : SellToUsStatus | null;
}
