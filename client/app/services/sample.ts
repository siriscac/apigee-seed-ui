/**
 * Created by siriscac on 20/07/16.
 */

import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {AuthService} from "./auth";

export class Sample {
    constructor(public id: string, public displayName: string, public name: string, public description: string, public long_description: string, public gitURL: string, public apiFolder: string, public user: any, public addedOn: any) {
    }
}

let Samples = [];

let samplesPromise = Promise.resolve(Samples);

@Injectable()
export class SampleService {

    private serverBaseURL: string = "http://localhost:5000";

    constructor(private http: Http, private authService: AuthService) {
        samplesPromise.then(samples => {
            if (samples.length == 0) {
                this.fetchSamples();
            }
        });
    }

    fetchSamples() {
        this.http.get(this.serverBaseURL + "/samples")
            .map(this.convertArray)
            .subscribe(samples => {
                for (let entity of samples) {
                    var sample: any = entity;
                    Samples.push(new Sample(sample.uuid, sample.display_name, sample.name, sample.description, sample.long_description,sample.git, sample.folder, 'Apigee', sample.created));
                }
            }, err => {
                console.error("Failed to fetch samples:", err);
            });
    }

    deploy(sample: Sample, callback) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        let org = this.authService.getSelectedOrg();
        let env = this.authService.getSelectedEnv();
        console.log('deploying sample ' + sample.name);
        var path = this.serverBaseURL + '/o/' + org + '/e/' + env + '/samples/' + sample.id;
        this.http.post(path, '', {headers: headers})
            .subscribe(
                data => {
                    callback(null, data);
                },
                err => {
                    console.log(err.json().message);
                    callback(err.json(), null);
                });
    }

    convertArray(res: Response) {
        let body = res.json();
        var t = [];
        for (let k in body) {
            t.push(body[k]);
        }
        console.log(t);
        return t
    }

    createSample(sample: Sample, callback) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        headers.append('Content-Type', 'application/json');

        let sampleData = JSON.stringify(sample);
        this.http.post(this.serverBaseURL + "/samples", sampleData, {headers: headers})
            .subscribe(
                data => {
                    var sp: Response = data;
                    var sample: any = JSON.parse(sp.text());
                    console.log(sample);
                    Samples.push(new Sample(sample.uuid, sample.display_name, sample.name, sample.description, '', sample.git_url, sample.api_folder, sample.user.email, sample.created));
                    callback(null, data);
                },
                err => {
                    console.log(err.json().message);
                    callback(err.json(), null);
                });
    }

    getSamples() {
        return samplesPromise;
    }

    getSample(id: number | string) {
        return samplesPromise
            .then(samples => samples.find(sample => sample.id === id));
    }
}
