import { GetListRequest } from "src/app/models/shared-models";
import { TicketStatus } from "..";

export class GetTicketList extends GetListRequest {
    customerId: number | null;
    subject: string| null;
    status: TicketStatus | null;
}
