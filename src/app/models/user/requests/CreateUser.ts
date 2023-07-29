import { UserRole } from "../../auth";


export class CreateUser {
    mobile: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    nationalCode: string | null;
}

