
import { ResponseWrapper } from "./ResponseWrapper";

export class GetListResponse<TViewModel> extends ResponseWrapper {
    totalSize: number;
    data: Array<TViewModel>;
}