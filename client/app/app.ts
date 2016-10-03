/**
 * Created by siriscac on 18/07/16.
 */

import {Component} from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdMenu} from '@angular2-material/menu';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {ROUTER_DIRECTIVES, Router}  from '@angular/router';
import {MdInput} from '@angular2-material/input';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

import {SampleService} from "./services/sample";
import {AuthService} from "./services/auth";
import {WindowService} from "./services/window/window";
import {WindowSize} from "./services/window/window-sizer";
import {TaskService} from "./services/task-service";

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
    title = 'Samples';
    notifItems: FirebaseListObservable<any[]>;

    constructor(private authService: AuthService, private windowSize: WindowSize, private router: Router, private taskService: TaskService, private af: AngularFire) {
        this.windowSize.width$.subscribe(width => {
            this.width = width;
        });
        this.registerFirebaseRef();
    }

    onscroll(){
        // var page: Element = document.getElementsByClassName("page-content-lg");
        // console.log(page[0].scrollTop);
    }

    navigateTo(href: string, title: string) {
        this.title = title;
        this.router.navigate(['/' + href]);
    }

    registerFirebaseRef(){
        this.notifItems = this.af.database.list('registry/tasks/' + this.authService.getSelectedOrg() + "-" + this.authService.getSelectedEnv());
    }

    doLogin() {
        this.authService.doLogin();
    }

    doLogout() {
        this.authService.doLogout();
    }

    setOrg(org: string) {
        this.authService.setSelectedOrg(org);
        this.taskService.fetchTasks(org);
        this.registerFirebaseRef();
    }

    setEnv(env: string) {
        this.authService.setSelectedEnv(env);
        this.registerFirebaseRef();
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

    get contentClass() {
        if (this.width < 800 && this.authService.isAuthenticated()) {
            return "page-content";
        } else {
            return "page-content-lg";
        }
    }

    get navMode() {
        if (this.width < 800) {
            return "over";
        } else {
            return "side";
        }
    }

    get isMobile() {
        return this.width < 800;
    }

}
