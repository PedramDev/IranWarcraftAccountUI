import { ResponseType } from "./ResponseType";

export class ResponseWrapper {
    isSuccess: boolean;
    message: string | null;
    type: ResponseType;
}