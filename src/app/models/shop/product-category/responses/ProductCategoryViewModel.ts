import { MediaViewModel } from "src/app/models/media";
import { PageStatus } from "src/app/models/shared-models";
import { WebPageViewModel } from "../../../shared-models/WebPageViewModel";
import {  ProductViewModel } from "../../products/responses/ProductViewModel";

export class ProductCategoryViewModel {
    id: number;
    name: string;
    content: string;
    excerpt: string;
    parentId: number | null;
    webPage: WebPageViewModel | null;
    parent: ProductCategoryViewModel | null;
    products: ProductViewModel[] | null;
    childs: ProductCategoryViewModel[] | null;
    image?: MediaViewModel;
    status:PageStatus;
}