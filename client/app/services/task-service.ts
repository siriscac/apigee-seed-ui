import {Http, Response, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Config} from "../../config/config";
import {AuthService} from "./auth";

let Tasks = [];

let tasksPromise = Promise.resolve(Tasks);

export class Task {
    constructor(public id: string, public name: string, public author: string, public time: Date, public status: string, public task: string) {

    }
}

@Injectable()
export class TaskService {
    private registryURL: string = Config.registryURL;

    constructor(private http: Http, private authService: AuthService) {
        tasksPromise.then(tasks => {
            if (tasks.length == 0) {
                this.fetchTasks();
            }
        });
    }

    public fetchTasks() {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        this.http.get(this.registryURL + "/tasks?org=" + this.authService.getSelectedOrg(), {headers: headers})
            .map(this.convertArray)
            .subscribe(tasks => {
                for (let entity of tasks) {
                    var task: any = entity;
                    Tasks.push(new Task(task.uuid, task.sample.display_name, task.user.username, new Date(task.created), task.status, task.task));
                }
            }, err => {
                console.error("Failed to fetch tasks:", err);
            });
    }

    public getTasks() {
        return tasksPromise;
    }

    public resetTasks(){
        while(Tasks.length){
            Tasks.pop();
        }
    }

    convertArray(res: Response) {
        let body = res.json();
        var t = [];
        for (let k in body) {
            t.push(body[k]);
        }
        return t;
    }

}
