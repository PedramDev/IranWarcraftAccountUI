import { MediaType } from "./MediaType";

export class MediaViewModel {
  
    id: number;
    url: string;
    size: number;
    contentType: string;
    name: string;
    dateCreated: string;
    extension: string;
    type: MediaType;
    containerId: number;
}