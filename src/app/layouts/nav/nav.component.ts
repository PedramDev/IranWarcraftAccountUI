import { Component, Inject } from "@angular/core";
// import { AuthService } from "src/app/core/services/auth.service";

@Component({
    selector: "app-nav",
    templateUrl: "./nav.component.html"
})
export class AppNavComponent {
    constructor(
        // @Inject('AuthService') private authService: AuthService,
    ) { }

    signout() {
        // this.authService.logout();
    }
}
