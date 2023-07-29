import { GetListRequest } from "src/app/models/shared-models";
import { LicenseStatus } from "../enums/LicenseStatus";


export class GetLicenseList extends GetListRequest {
    sellerId: number | null;
    fromDate: string | null;
    toDate: string | null;
    variantId: number | null;
    status: LicenseStatus | null;
}
