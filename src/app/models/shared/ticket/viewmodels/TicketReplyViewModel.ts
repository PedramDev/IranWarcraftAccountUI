import { MediaViewModel } from "src/app/models/media";
import { UserViewModel } from "src/app/models/user/viewmodels/UserViewModel";

export class TicketReplyViewModel {
    id: number;
    message: string;
    createdAt: string;
    seenByModerator: boolean;
    seenByUser: boolean;
    userId: number;
    user: UserViewModel;
    ticketId: number;
    attachments: MediaViewModel[];
}
