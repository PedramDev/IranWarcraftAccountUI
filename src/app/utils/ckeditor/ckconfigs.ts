export class CkConfig {

    isLtr: boolean;

    constructor(isLtr?: boolean) {

    }

    private getLang() {
        if (this.isLtr) {
            return 'en';
        }
        else {
            return 'fa';
        }
    }
    ticketEditor() {
        return {
            language: {
                // The UI will be English.
                ui: this.getLang(),

                // But the content will be edited in Arabic.
                content: this.getLang()
            },
            toolbar: ['bold', 'italic']
        };
    }

    htmlEditor(){
        return {
            language: {
                // The UI will be English.
                ui: this.getLang(),

                // But the content will be edited in Arabic.
                content: this.getLang()
            }
        };
    }
}