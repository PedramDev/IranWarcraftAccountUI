import { MediaViewModel } from "src/app/models/media";
import { PageStatus } from "src/app/models/shared-models";
import { WebPageViewModel } from "../../../shared-models/WebPageViewModel";
import {  ArticleViewModel } from "../../article/responses/ArticleViewModel";

export class ArticleCategoryViewModel {
    id: number;
    name: string;
    content: string;
    excerpt: string;
    parentId: number | null;
    webPage: WebPageViewModel | null;
    parent: ArticleCategoryViewModel | null;
    articles: ArticleViewModel[] | null;
    childs: ArticleCategoryViewModel[] | null;
    image?: MediaViewModel;
    status: PageStatus;
}