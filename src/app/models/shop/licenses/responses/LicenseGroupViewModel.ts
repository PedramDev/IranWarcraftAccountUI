import { UserViewModel } from "src/app/models/user";
import { LicenseViewModel } from "./LicenseViewModel";

export class LicenseGroupViewModel {
    id: number;
    seller: UserViewModel;
    licenses: LicenseViewModel[];
}
