import { GetListRequest } from "../../../shared-models/GetListRequest";
export class GetBankAccountList extends GetListRequest {
    currentUserId: number | null;
}
