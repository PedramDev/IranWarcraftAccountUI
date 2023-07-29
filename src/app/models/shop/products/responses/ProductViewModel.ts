import { VariantViewModel } from "../responses/VariantViewModel";
import { WebPageViewModel } from "../../../shared-models/WebPageViewModel";
import { ProductCategoryViewModel } from "../../product-category/responses/ProductCategoryViewModel";
import { MediaViewModel } from "src/app/models/media";
import { PageStatus } from "src/app/models/shared-models";

export class ProductViewModel {
    id: number;
    name: string;
    content: string;
    excerpt: string;
    defaultVariantId: number | null;
    categoryId: number | null;
    webPage: WebPageViewModel;
    defaultVariant: VariantViewModel | null;
    category: ProductCategoryViewModel | null;
    variants: VariantViewModel[];
    image?: MediaViewModel;
    status:PageStatus;
}