export class ContactMessageViewModel {
    id: number;
    name: string;
    message: string;
    email: string | null;
    phone: string | null;
    archived: boolean;
    read: boolean;
    createdAt: string;
    readAt: string | null;

    createdAtShamsi: string | null;
    readAtShamsi: string | null;

}
