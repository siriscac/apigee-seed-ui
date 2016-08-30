/**
 * Created by siriscac on 18/07/16.
 */

import {Component} from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdMenu} from '@angular2-material/menu';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {ROUTER_DIRECTIVES}  from '@angular/router';
import {MdInput} from '@angular2-material/input';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

import {SampleService} from "./services/sample";
import {AuthService} from "./services/auth";
import {WindowService} from "./services/window";
import {WindowSize} from "./services/window-sizer";

@Component({
    selector: 'app',
    templateUrl: './app.html',
    styleUrls: ['app.css'],
    directives: [
        MD_SIDENAV_DIRECTIVES,
        ROUTER_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MdToolbar,
        MdButton,
        MdInput,
        MdMenu,
        MdIcon
    ],
    providers: [WindowService, AuthService, SampleService, MdIconRegistry]
})

export class AppComponent {
    width: any;
    title = 'Seed';

    sections: Object[] = [
        {
            name: "Samples",
            description: "Browse the list of all samples",
            icon: "leak_add",
            href: "samples"
        },
        {
            name: "Contribute",
            description: "Contribute to Apigee Seed",
            icon: "create",
            href: "add"
        }
    ];

    constructor(private authService: AuthService, private windowSize: WindowSize) {
        this.windowSize.width$.subscribe(width => {
            this.width = width
        });
    }

    doLogin() {
        this.authService.doLogin();
    }

    doLogout() {
        this.authService.doLogout();
    }

    setOrg(org: string) {
        this.authService.setSelectedOrg(org);
    }

    setEnv(env: string) {
        this.authService.setSelectedEnv(env);
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

    get username() {
        return this.authService.getUserName();
    }

    get email() {
        return this.authService.getUserEmail();
    }

    get orgs() {
        return this.authService.getUserOrgs();
    }

    get selectedOrg() {
        return this.authService.getSelectedOrg();
    }

    get selectedEnv() {
        return this.authService.getSelectedEnv();
    }

    get navMode() {
        if (this.width < 800) {
            return "over";
        } else {
            return "side";
        }
    }

    get isMobile() {
        if (this.width < 800) {
            return true;
        } else {
            return false;
        }
    }

}