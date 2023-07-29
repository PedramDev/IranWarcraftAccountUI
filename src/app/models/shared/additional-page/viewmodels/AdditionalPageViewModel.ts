import { MediaViewModel } from "src/app/models/media";
import { PageStatus } from "src/app/models/shared-models";
import { WebPageViewModel } from "src/app/models/shared-models/WebPageViewModel";

export class AdditionalPageViewModel {
    id: number;
    content: string;
    status: PageStatus;
    title: string;
    description: string;
    slug: string;
    image: MediaViewModel | null;
    webPage: WebPageViewModel;
}
