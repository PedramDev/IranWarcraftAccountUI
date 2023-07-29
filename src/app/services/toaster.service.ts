import { Injectable } from "@angular/core";
import { NzMessageService } from 'ng-zorro-antd/message';
import { MessageType } from "./MessageType";

@Injectable()
export class AppToasterService {
    constructor(
        private message: NzMessageService
        ) { }

        toast(type: MessageType,message :string): void {
            this.message.create(type, message);
        }

        /**
         * 
         * @param message 
         * @param delay immediate = 0
         */
        loadingMessage(message:string='درحال بارگزاری...',delay:number = 1500): void {
            const id = this.message.loading(message, { nzDuration: 0 }).messageId;
            setTimeout(() => {
              this.message.remove(id);
            }, delay);
        }

        warning(message:string):void{
            this.message.create(MessageType.warning , message);
        }
}
