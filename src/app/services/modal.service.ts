import { Injectable } from "@angular/core";

declare let UIkit: any;

@Injectable()
export class AppModalService {
    alert = (message: string) => UIkit.modal.alert(message);
}
