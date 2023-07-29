import { UserRole } from "../enums/UserRole";

export class AuthenticateViewModel {
    token: string;
    role: UserRole;
    id: number;
    expiredIn: number;
}
