/**
 * Created by siriscac on 20/07/16.
 */

import {Injectable} from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {AuthService} from "./auth";
import {Config} from "../../config/config";

export class Sample {
    public testURL: string;

    constructor(public id: string, public displayName: string, public name: string, public description: string, public long_description: string, public gitURL: string, public apiFolder: string, public user: any, public addedOn: any, public envVars: any) {
    }
}

let Samples = [];
let samplesPromise = Promise.resolve(Samples);

@Injectable()
export class SampleService {

    public genericCallback: {(err: string, msg: string): void;};

    private registryURL: string = Config.registryURL;

    constructor(private http: Http, private authService: AuthService) {
        samplesPromise.then(samples => {
            if (samples.length == 0) {
                this.fetchSamples();
            }
        });
    }

    fetchSamples() {
        this.http.get(this.registryURL + "/samples")
            .map(this.convertArray)
            .subscribe(samples => {
                for (let entity of samples) {
                    var sample: any = entity;
                    var s = new Sample(sample.uuid, sample.display_name, sample.name, sample.description, sample.long_description, sample.git_repo, sample.api_folder, sample.user, sample.created, sample.envVars);
                    Samples.push(s);
                    s.testURL = this.registryURL + '/v1/o/' + this.authService.getSelectedOrg() +
                        '/e/' + this.authService.getSelectedEnv() + '/samples/' + sample.name + '/tests/test.html';
                }
            }, err => {
                console.error("Failed to fetch samples:", err);
            });
    }

    convertArray(res: Response) {
        let body = res.json();
        var t = [];
        for (let k in body) {
            t.push(body[k]);
        }
        return t;
    }

    createSample(sample: Sample) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        headers.append('Content-Type', 'application/json');

        let sampleData = JSON.stringify(sample);

        let createPromise = new Promise((resolve, reject) => {
            this.http.post(this.registryURL + "/samples", sampleData, {headers: headers})
                .subscribe(
                    data => {
                        var sp: Response = data;
                        var sample: any = JSON.parse(sp.text());
                        console.log(sample);
                        var s = new Sample(sample.uuid, sample.display_name, sample.name, sample.description, '', sample.git_url, sample.api_folder, sample.user.email, sample.created, sample.envVars);
                        Samples.push(s);
                        s.testURL = this.registryURL + '/v1/o/' + this.authService.getSelectedOrg() +
                            '/e/' + this.authService.getSelectedEnv() + '/samples/' + sample.name + '/tests/test.html';
                        resolve(data);
                    },
                    err => {
                        console.log(err.json().message);
                        reject(err);
                    });
        });
        return createPromise;
    }

    deleteSample(sample: Sample) {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);

        let deletePromise = new Promise((resolve, reject) => {
            this.http.delete(this.registryURL + "/samples/" + sample.id, {headers: headers})
                .subscribe(
                    data => {
                        console.log(data);
                        resolve(data)
                    },
                    err => {
                        console.log("error deleting sample " + err)
                        reject(err);
                    });
        });

        return deletePromise;
    }

    getSampleFromRegistry(id) {
        return this.http.get(this.registryURL + "/samples/" + id);
    }

    getSamples() {
        return samplesPromise;
    }

    getMySamples(): Promise<Sample[]> {
        let samplePromise = new Promise((resolve, reject) => {
            let ql = "select * where user.user_email='" + this.authService.getUserEmail() + "'";
            this.http.get(this.registryURL + "/samples?ql=" + ql)
                .map(this.convertArray)
                .subscribe(samples => {
                    let contribSamples = [];
                    for (let entity of samples) {
                        var sample: any = entity;
                        var s = new Sample(sample.uuid, sample.display_name, sample.name, sample.description, sample.long_description, sample.git_repo, sample.api_folder, sample.user, sample.created, sample.envVars);
                        contribSamples.push(s);
                        s.testURL = this.registryURL + '/v1/o/' + this.authService.getSelectedOrg() +
                            '/e/' + this.authService.getSelectedEnv() + '/samples/' + sample.name + '/tests/test.html';
                    }
                    resolve(contribSamples);
                }, err => {
                    console.error("Failed to fetch My samples:", err);
                });
        });
        return samplePromise;
    }

    getSample(id: number | string) {
        return samplesPromise
            .then(samples => {
                if (samples.length > 0) {
                    return samples.find(sample => sample.name === id);
                } else {
                    return null;
                }
            });
    }
}
