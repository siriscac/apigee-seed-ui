/**
 * Created by siriscac on 18/07/16.
 */

import {Component, OnInit} from '@angular/core';

import {AuthService} from "../../services/auth";
import {Task, TaskService} from "../../services/task-service";

@Component({
    styleUrls: ['./tasks.css'],
    templateUrl: './tasks.html'
})

export class TaskComponent implements OnInit {

    private tasks: Task[];

    constructor(private authService: AuthService, private taskService: TaskService) {

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
        else if (status == "Failure")
            return "tag-failure";
        else
            return "tag-progress";
    }
}
