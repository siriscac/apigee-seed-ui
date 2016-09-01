/**
 * Created by siriscac on 18/07/16.
 */

import {Component} from '@angular/core';
import {AuthService} from "../../services/auth";
import {Http, Response, Headers} from "@angular/http";
import {Config} from "../../../config/config";

let Tasks = [];

let tasksPromise = Promise.resolve(Tasks);

export class Task {
    constructor(public id: string, public name: string, public author: string, public time: Date, public status: string, public task: string) {

    }
}

@Component({
    styleUrls: ['./tasks.css'],
    templateUrl: './tasks.html'
})

export class TaskComponent {

    private tasks: Task[];
    private registryURL: string = Config.registryURL;

    constructor(private http: Http, private authService: AuthService) {
        tasksPromise.then(tasks => {
            if (Tasks.length == 0) {
                this.getTasks();
            } else {
                this.tasks = tasks;
            }
        });
    }

    getTasks() {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        this.http.get(this.registryURL + "/tasks?org=" + this.authService.getSelectedOrg(), {headers: headers})
            .map(this.convertArray)
            .subscribe(tasks => {
                for (let entity of tasks) {
                    var task: any = entity;
                    Tasks.push(new Task(task.uuid, task.sample.display_name, task.user.username, new Date(task.created), task.status, task.task));
                }
                this.tasks = Tasks;
            }, err => {
                console.error("Failed to fetch tasks:", err);
            });
    }

    convertArray(res: Response) {
        let body = res.json();
        var t = [];
        for (let k in body) {
            t.push(body[k]);
        }
        return t;
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }
}
