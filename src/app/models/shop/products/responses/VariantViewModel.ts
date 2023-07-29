import { SellToUsStatus } from "src/app/models/shared-models";
import { RegionViewModel } from "../../regions/responses/RegionViewModel";

export class VariantViewModel {
    id: number;
    price: number;
    region: RegionViewModel;
    name: string;
    sellPrice: number;
    buyPrice: number;
    sellToUsStatus : SellToUsStatus;
}