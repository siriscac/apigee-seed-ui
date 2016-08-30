/**
 * Created by siriscac on 28/07/16.
 */

import {Injectable}     from '@angular/core';
import {CanActivate}    from '@angular/router';
import {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";

@Injectable()
export class AuthGuard implements CanActivate {

    @LocalStorage() private expires: any;

    constructor() {

    }

    canActivate() {
        var snackbarContainer: any = document.querySelector('#toast');

        var timeDiff = this.expires - (new Date().getTime());
        timeDiff = Math.round(timeDiff / 1000);
        console.log(timeDiff);
        if (timeDiff > 0) {
            console.log("valid");
            return true;
        } else {
            console.log(snackbarContainer);
            //noinspection TypeScriptUnresolvedFunction
            snackbarContainer.MaterialSnackbar.showSnackbar({message: "Please login to contribute"});
            console.log("invalid");
            return false;
        }

    }

}