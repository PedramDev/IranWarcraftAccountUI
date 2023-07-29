import { BaseUpdate } from "src/app/models/shared-models";

export class PatchContactMessage extends BaseUpdate {
    archived: boolean | null;
    read: boolean | null;
}
