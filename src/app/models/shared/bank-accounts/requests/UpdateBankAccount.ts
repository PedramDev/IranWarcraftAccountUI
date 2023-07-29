import { BaseUpdate } from "../../../shared-models/BaseUpdate";

export class UpdateBankAccount extends BaseUpdate {
    currentUserId: number | null;
    title: string;
    ownerName: string;
    bankName: string;
    accountNumber: string;
    cardNumber: string;
    sheba: string;
}
