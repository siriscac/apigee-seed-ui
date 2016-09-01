/**
 * Created by siriscac on 18/07/16.
 */

import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth";
import {Task, TaskService} from "../../services/task-service";
import {ActivatedRoute} from "@angular/router";

@Component({
    styleUrls: ['./tasks.css'],
    templateUrl: './tasks.html'
})

export class TaskComponent implements OnInit {

    private tasks: Task[];
    private sub:any;

    constructor(private authService: AuthService, private taskService: TaskService, private route: ActivatedRoute) {
        this.taskService.getTasks()
            .then(tasks => this.tasks = tasks);
    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.taskService.getTasks()
                    .then(tasks => this.tasks = tasks);
            });
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }
}
