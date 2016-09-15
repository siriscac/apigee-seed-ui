/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute}       from '@angular/router';
import {DomSanitizationService, SafeHtml} from "@angular/platform-browser";
import {Response} from "@angular/http";

import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdTabChangeEvent} from '@angular2-material/tabs';

import {Sample, SampleService}   from '../../../services/sample';
import {TaskService} from "../../../services/task-service";
import {AuthService} from "../../../services/auth";
import {DeployService} from "../../../services/deploy";
import {Config} from "../../../../config/config";

declare var mocha: any;
declare var assert: any;

@Component({
    templateUrl: 'sample-detail.html',
    styleUrls: ['sample-detail.css'],
    directives: [
        MD_CARD_DIRECTIVES
    ],
    providers: [MdTabChangeEvent, DeployService]
})

export class SampleDetailComponent implements OnInit, OnDestroy {
    private sample: Sample;
    private sub: any;
    private selectedIndex: number = 0;
    private taskLog: string;
    private dataLoaded: boolean = false;

    constructor(private route: ActivatedRoute, private router: Router, private service: SampleService, private authService: AuthService, private _sanitizer: DomSanitizationService, private deployService: DeployService, private taskService: TaskService) {
        this.taskLog = "<div class=\"loader\" style=\"height: 550px\"><div class=\"loader__figure\"><\/div><div class=\"loader__label\">Deployment in progress..<\/div><\/div>";
        this.deployService.progress$.subscribe(
            data => {
                console.log('RESP:' + data);
                this.taskLog = data;
            });
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
                let id = params['id'];
                this.service.getSample(id).then(sample => {
                    if (!sample) {
                        this.service.getSampleFromRegistry(id).map((res: Response) => res.json()).subscribe(sample => {
                            sample = sample[0];
                            this.sample = new Sample(sample.uuid, sample.display_name, sample.name, sample.description, sample.long_description, sample.git_repo, sample.folder, sample.user, sample.created,sample.envVars);
                            this.displayData();
                        });
                    } else {
                        this.sample = sample;
                        this.displayData();
                    }

                }).catch(error => {
                    console.log("Error - " + error);
                });
            }
        );
    }

    displayData() {
        this.dataLoaded = true;
    }

    getURL() {
        return Config.registryURL + "/v1/o/" + this.authService.getSelectedOrg() + "/e/" + this.authService.getSelectedEnv() + "/samples/" + this.sample.name + "/tests/test.html";
    }

    runTest() {
        this.selectedIndex = 2;
    }

    clean() {
        this.selectedIndex = 1;
        let org = this.authService.getSelectedOrg();
        let env = this.authService.getSelectedEnv();
        console.log('Cleaning sample ' + this.sample.name);
        var path = Config.registryURL + '/o/' + org + '/e/' + env + '/samples/' + this.sample.id;
        this.deployService.clean(path, `Bearer ${this.authService.getToken()}`).subscribe(() => {
        });
    }

    deploy() {
        this.selectedIndex = 1;
        let org = this.authService.getSelectedOrg();
        let env = this.authService.getSelectedEnv();
        let c = confirm("Are you sure you want to deploy this sample in the org. " + org + " under " + env + " environment?");
        if(c == true){
            console.log('Deploying sample ' + this.sample.name);
            var path = Config.registryURL + '/o/' + org + '/e/' + env + '/samples/' + this.sample.id;
            this.deployService.deploy(path, `Bearer ${this.authService.getToken()}`).subscribe(() => {
            });
            this.taskService.fetchTasks(null);
        }
    }

    get testHtml(): SafeHtml {
        var wrapper: any = '<object type="text/html" style="width:100%;height: 570px" data="' + this.getURL() + '"></object>';
        return this._sanitizer.bypassSecurityTrustHtml(wrapper);
    }

    get taskLogs() {
        return this.deployService.getLogs().replace(/\/n/g, "<br>");
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
