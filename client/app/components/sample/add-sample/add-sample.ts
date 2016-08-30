/**
 * Created by siriscac on 21/07/16.
 */

import {Component} from '@angular/core';
import {Http} from "@angular/http";
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router} from "@angular/router";
import {MdButton} from '@angular2-material/button';
import {MdInput} from '@angular2-material/input';

import {AuthService} from "../../../services/auth";
import {Sample, SampleService} from "../../../services/sample";


@Component({
    templateUrl: './add-sample.html',
    styleUrls: ['add-sample.css'],
    directives: [
        MdButton,
        MdInput,
        FORM_DIRECTIVES
    ]
})

export class AddSampleComponent {

    private spinner_html: any = "<div class=\"mdl-spinner mdl-js-spinner is-active left-center\"><\/div>";
    private contrib_guide: any = this.spinner_html;
    private hide_form: boolean = true;
    private show_spinner: boolean = false;
    private sample: Sample;
    private sampleForm: FormGroup;
    private serverBaseURL: string = "http://localhost:5000";


    constructor(private http: Http, private authService: AuthService, private sampleService: SampleService, private formBuilder: FormBuilder, private router: Router) {
        this.getContribGuide();

        this.sampleForm = formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            gitURL: ['', Validators.required],
            apiFolder: ['', Validators.required],
            addedBy: [this.authService.getUserEmail(), Validators.required]
        });
    }

    getContribGuide() {
        this.http.get(this.serverBaseURL + "/contribution-guide")
            .subscribe(
                data => {
                    this.contrib_guide = data.text()
                },
                err => console.log(err.text())
            );
    }

    toggleGuide() {
        if (this.hide_form == false) {
            this.hide_form = true;
        } else {
            this.hide_form = false;
        }
    }

    save() {
        var data: any = this.sampleForm.value;
        this.show_spinner = true;
        this.sample = new Sample('', '', data.name, data.description, data.gitURL, data.apiFolder, this.authService.getUserInfo(), '');
        this.sampleService.createSample(this.sample, function (error, data) {
            if (data) {
                console.log(data);
                this.router.navigate(['/samples']);
            } else {
                console.log(error);
            }
        });
    }

    doLogin() {
        this.authService.doLogin();
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

}