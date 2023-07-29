import { PageStatus } from "src/app/models/shared-models";

export class UpdateAdditionalPage {
    id: number;
    content: string;
    status: PageStatus;
    title: string;
    description: string;
    slug: string;
}
