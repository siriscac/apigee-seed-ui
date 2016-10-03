/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute}       from '@angular/router';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Response} from "@angular/http";

import {MdTabChangeEvent} from '@angular2-material/tabs';

import {Sample, SampleService}   from '../../../services/sample';
import {TaskService} from "../../../services/task-service";
import {AuthService} from "../../../services/auth";
import {ToastService} from "../../../services/toast";
import {DeployService} from "../../../services/deploy";
import {Config} from "../../../../config/config";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

declare var mocha: any;
declare var assert: any;

@Component({
    templateUrl: 'sample-detail.html',
    styleUrls: ['sample-detail.css'],
    providers: [MdTabChangeEvent, DeployService]
})

export class SampleDetailComponent implements OnInit, OnDestroy {
    private sample: Sample;
    private sub: any;
    private selectedIndex: number = 0;
    private taskLog: string;
    private dataLoaded: boolean = false;
    private envForm: FormGroup;

    constructor(private route: ActivatedRoute, private router: Router, private service: SampleService, private authService: AuthService, private _sanitizer: DomSanitizer, private deployService: DeployService, private formBuilder: FormBuilder, private taskService: TaskService, private toast: ToastService) {
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
                        console.log("sad");
                        this.service.getSampleFromRegistry(id).map((res: Response) => res.json()).subscribe(sample => {
                            sample = sample[0];
                            this.sample = new Sample(sample.uuid, sample.display_name, sample.name, sample.description, sample.long_description, sample.git_repo, sample.folder, sample.user, sample.created, sample.envVars, sample.sample_type);
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
        var formGroup = {};
        if (this.sample.envVars) {
            for (var item of this.sample.envVars) {
                formGroup[item] = ['', Validators.required];
            }
            console.log(formGroup);
            this.envForm = this.formBuilder.group(formGroup);
        }

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
        if (c == true) {
            this.toast.showToast('Deploying sample ' + this.sample.name);
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

    get topPadding() {
        var e: Element = document.getElementsByClassName("sticky-card")[0];
        return e.clientHeight + 1;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
