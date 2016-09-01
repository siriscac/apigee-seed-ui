/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute}       from '@angular/router';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdTabChangeEvent} from '@angular2-material/tabs';

import {Sample, SampleService}   from '../../../services/sample';
import {AuthService} from "../../../services/auth";
import {DomSanitizationService, SafeHtml} from "@angular/platform-browser";
import {DeployService} from "../../../services/deploy";
import {Config} from "../../../../config/config";

declare var mocha: any;
declare var chai: any;
declare var async: any;
declare var assert: any;
declare var jQuery: any;
declare var parent: any;

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
    private tabs: any;
    private taskLog: string;

    constructor(private route: ActivatedRoute, private router: Router, private service: SampleService, private authService: AuthService, private _sanitizer: DomSanitizationService, private deployService: DeployService) {
        this.taskLog = "<div class=\"loader\" style=\"height: 550px\"><div class=\"loader__figure\"><\/div><div class=\"loader__label\">Deployment in progress<\/div><\/div>";
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
                this.sample = sample;
                this.tabs = [
                    {label: 'Description', content: sample.long_description, padding: true},
                    {label: 'Deploy Logs', content: this.taskLogs, padding: true},
                    {label: 'Test', content: this.testHtml, padding: false},
                ];
            });
        });
    }

    getURL() {
        console.log(this.sample.testURL);
        return Config.registryURL + "/v1/o/" + this.authService.getSelectedOrg() + "/e/" + this.authService.getSelectedEnv() + "/samples/" + this.sample.name + "/tests/test.html";
    }

    runTest() {
        this.selectedIndex = 2;
    }

    get testHtml(): SafeHtml {
        var wrapper: any = '<object type="text/html" style="width:100%;height: 570px" data="' + this.getURL() + '"></object>';
        return this._sanitizer.bypassSecurityTrustHtml(wrapper);
    }

    get taskLogs() {
        return this.deployService.getLogs().replace(/\/n/g, "<br>");
    }


    deploy() {
        this.selectedIndex = 1;
        let org = this.authService.getSelectedOrg();
        let env = this.authService.getSelectedEnv();
        console.log('Deploying sample ' + this.sample.name);
        var path = Config.registryURL + '/o/' + org + '/e/' + env + '/samples/' + this.sample.id;
        this.deployService.deploy(path, `Bearer ${this.authService.getToken()}`).subscribe(() => {});
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }
}
