import { SellToUsStatus } from "src/app/models/shared-models";

export class UpdateVariant{
    id: number| null;
    productId: string;
    regionId: number | null;
    sellPrice: number;
    buyPrice: number;
    sellToUsStatus : SellToUsStatus;
}
