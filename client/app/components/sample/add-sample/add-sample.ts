/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Router} from "@angular/router";

import {AuthService} from "../../../services/auth";
import {Sample, SampleService} from "../../../services/sample";
import {Config} from "../../../../config/config";
import {ToastService} from "../../../services/toast";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";


@Component({
    templateUrl: './add-sample.html',
    styleUrls: ['add-sample.css']
})

export class AddSampleComponent implements OnInit {

    private spinner_html: any = "<div class=\"mdl-spinner mdl-js-spinner is-active left-center\"><\/div>";
    private contrib_guide: any = this.spinner_html;
    private hide_form: boolean = false;
    private show_spinner: boolean = false;
    private sample: Sample;
    private sampleForm: FormGroup;
    private sampleType: string;
    private registryURL: string = Config.registryURL;

    constructor(private http: Http, private authService: AuthService, private sampleService: SampleService, private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private router: Router, private toast: ToastService) {

    }

    ngOnInit() {
        this.getContribGuide();

        this.sampleForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            gitURL: ['', Validators.required],
            apiFolder: ['', Validators.required],
            addedBy: [this.authService.getUserEmail(), Validators.required],
            envVars: [''],
            sampleType: ['', Validators.required]
        });
    }

    getContribGuide() {
        this.http.get(this.registryURL + "/contribution-guide")
            .subscribe(
                data => {
                    this.contrib_guide = data.text()
                },
                err => console.log(err.text())
            );
    }

    toggleGuide() {
        this.hide_form = this.hide_form == false;
    }

    onChange(value) {
        this.sampleType = value;
    }

    save() {
        var data: any = this.sampleForm.value;

        this.show_spinner = true;
        var vars = [];
        if (data.envVars && data.envVars.trim() != '') {
            var splits = data.envVars.split(',');
            splits.forEach(function (s) {
                vars.push(s);
            });
        }

        this.sample = new Sample('', '', data.name, data.description, '', data.gitURL, data.apiFolder, this.authService.getUserInfo(), '', vars, this.sampleType);
        this.toast.showToast("Creating sample - " + this.sample.name);

        this.sampleService.createSample(this.sample)
            .then((data) => {
                console.log(data);
                this.toast.showToast(this.sample.name + " was created successfully");
            })
            .catch((err) => {
                console.log(err);
            });

        this.redirectToSamples();
    }

    doLogin() {
        this.authService.doLogin();
    }

    redirectToSamples() {
        this.router.navigate(['/samples']);
    }

    get contribGuide(): SafeHtml {
        var wrapper: any = this.contrib_guide;
        return this._sanitizer.bypassSecurityTrustHtml(wrapper)
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

}
