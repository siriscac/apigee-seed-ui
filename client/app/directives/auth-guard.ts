import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../services/auth";
import {Inject, Injectable} from "@angular/core";
import {LocalStorage} from "angular2-localstorage/WebStorage";

@Injectable()
export class AuthGuard implements CanActivate {

    @LocalStorage() private token: string;
    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate() {
        console.log(this.token);
        if (this.token != null) {
            return true;
        } else {
            this.router.navigate(['/samples']);
            return false;
        }
    }


}
