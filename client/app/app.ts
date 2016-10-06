/**
 * Created by siriscac on 18/07/16.
 */

import {Component} from '@angular/core';
import {Router}  from '@angular/router';
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
    providers: [WindowService, AuthService, SampleService]
})

export class AppComponent {
    width: any;
    title = 'Samples';
    notifCount: number = 0;
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
        this.notifCount = 0;
        this.notifItems = this.af.database.list('registry/tasks/' + this.authService.getSelectedOrg() + "-" + this.authService.getSelectedEnv()).map(items => items.sort((a, b) => b.time - a.time))  as FirebaseListObservable<any[]>;
        this.notifItems.subscribe(item => {
            this.notifCount = item.length;
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
        this.taskService.fetchTasks(org);
        this.registerFirebaseRef();
    }

    setEnv(env: string) {
        this.authService.setSelectedEnv(env);
        this.registerFirebaseRef();
    }

    get showNotif(){
        return this.notifCount > 0;
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

    get isAdmin(){
        return this.authService.isAdmin();
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
