import { Component } from "@angular/core";
import { UserRole } from "src/app/models/auth";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: "app-cpanel-dashboard",
    templateUrl: "./cpanel.component.html"
})
export class AppCpanelDashboardComponent{
    submitted = false;
    constructor(
        public authService : AuthService
    )
    {
            console.log('AppCpanelDashboardComponent');
    }
    
    createFakeUser():void{
        this.authService.createFake().subscribe(c=>{
            
        });
    }
    login(role :string) : void {
        this.authService.fakeUser(role).subscribe(c=>{
            if(c.isSuccess){
                this.authService.setLogin(c.data);
            }
        })
    }
}
