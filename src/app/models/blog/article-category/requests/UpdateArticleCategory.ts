import { BaseUpdate } from "../../../shared-models/BaseUpdate";


export class UpdateArticleCategory extends BaseUpdate {
    title: string;
    description: string;
    slug: string;
    name: string;
    content: string;
    excerpt: string;
    parentId: number | null;
}
