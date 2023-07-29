import { UserRole } from "../../auth";

export class UserViewModel {
    id:number;
    name:string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    normalizedEmailAddress: string;
    isEmailVerified: boolean;
    emailVerifiedAt: string;
    mobileNumber: string;
    isMobileVerified: boolean;
    mobileVerifiedAt: string;
    info:string;
    inactive:boolean;
    role:UserRole;
}