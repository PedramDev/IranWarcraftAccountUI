import { BaseUpdate } from "src/app/models/shared-models";
import { LicenseStatus } from "../enums/LicenseStatus";

export class PatchLicense extends BaseUpdate {
    status: LicenseStatus | null;
}
