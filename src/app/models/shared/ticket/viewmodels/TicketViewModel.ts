import { UserViewModel } from "src/app/models/user/viewmodels/UserViewModel";
import { TicketStatus } from "../enums/TicketStatus";
import { TicketReplyViewModel } from "./TicketReplyViewModel";

export class TicketViewModel {
    id: number;
    subject: string;
    createdAt: string;
    customerId: number;
    status: TicketStatus;
    replies: TicketReplyViewModel[];
    user: UserViewModel;
}
