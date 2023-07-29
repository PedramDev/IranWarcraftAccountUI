import { ResponseWrapper } from "./ResponseWrapper";

export class TResponseWrapper<TData> extends ResponseWrapper {
    data: TData | null;
}

