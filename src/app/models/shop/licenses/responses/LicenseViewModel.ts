import { LicenseStatus } from "../enums/LicenseStatus";
import { LicenseGroupViewModel } from "./LicenseGroupViewModel";
import { VariantViewModel } from "../../products";

export class LicenseViewModel {
    code: string;
    variantId: number;
    boughtPrice: number;
    sellerId: number | null;
    soldDate: string | null;
    statusChangedAt: string | null;
    createdAt: string;
    battleTag: string | null;
    description: string | null;
    status: LicenseStatus;
    groupId: number | null;
    group: LicenseGroupViewModel | null;
    variant: VariantViewModel;
}
