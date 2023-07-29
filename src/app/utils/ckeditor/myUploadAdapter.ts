import { MediaType } from "src/app/models/media/requests/MediaType";
import { CONSTANST } from "src/app/utils/constanst";

export class MyUploadAdapter {
  public loader: any;
  public url: string;
  public xhr: XMLHttpRequest;
  public token: string;
  private mediaType : MediaType;
  private key:number|string;

  constructor(loader:any,mediaType:MediaType,key:number|string) {
    this.loader = loader;
    this.mediaType = mediaType;
    this.key = key;

    // change "environment.BASE_URL" key and API path
    this.url = CONSTANST.routes.media;

    // change "token" value with your token
    this.token = localStorage.getItem("token");
  }

  upload() {
    return new Promise(async (resolve, reject) => {
      this.loader.file.then((file:any) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      });
    });
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
  
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", this.url, true);

    // change "Authorization" header with your header
    xhr.setRequestHeader("Authorization", this.token);

    xhr.responseType = "json";
  }

  _initListeners(resolve:any, reject:any, file:any) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = "Couldn't upload file:" + ` ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());

    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      // change "response.data.fullPaths[0]" with image URL
      resolve({
        default: CONSTANST.Front+response.data.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file:any) {
    const data = new FormData();

    // change "attachments" key
    data.append("file", file);
    data.append("type", this.mediaType);
    data.append("key", this.key.toString());
    
    this.xhr.send(data);
  }
}