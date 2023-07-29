import { UserAttachmentType } from "../enums/UserAttachmentType";


export class CreateUserAttachment {
    type: UserAttachmentType;
    file: File;
}
