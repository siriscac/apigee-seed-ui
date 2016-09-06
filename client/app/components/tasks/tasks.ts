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
    private sub: any;

    constructor(private authService: AuthService, private taskService: TaskService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.taskService.getTasks()
            .then(tasks => {
                this.tasks = tasks;
                if (tasks.length < 0) {
                    this.taskService.fetchTasks(null);
                }
            });
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }


    statusTag(status) {
        if (status == "Success")
            return "tag-success";
        else if (status == "Failed")
            return "tag-failure";
        else
            return "tag-progress";
    }
}
