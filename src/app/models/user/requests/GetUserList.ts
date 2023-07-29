import { UserRole } from "../../auth";
import { GetListRequest } from "../../shared-models";


export class GetUserList extends GetListRequest {
    role: UserRole[] | null;
}