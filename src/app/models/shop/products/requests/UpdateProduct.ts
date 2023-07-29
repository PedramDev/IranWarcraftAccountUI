import { PageStatus } from "src/app/models/shared-models";
import { TBaseUpdate } from "../../../shared-models/TBaseUpdate";
import { UpdateVariant } from "./UpdateVariant";


export class UpdateProduct extends TBaseUpdate<number> {
    status:PageStatus;
    name: string;
    content: string;
    excerpt:string;
    defaultVariantId: number | null;
    categoryId: number | null;
    title: string;
    description: string;
    slug: string;
    variants: UpdateVariant[] = [];
    removeListOfVariants : number[] | null = [];
}
