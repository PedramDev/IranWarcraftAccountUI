import { TicketStatus } from "../enums/TicketStatus";

export class PatchTicketByModerator {
    id: number;
    status: TicketStatus;
}
