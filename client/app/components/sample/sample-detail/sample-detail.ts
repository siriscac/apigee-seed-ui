/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute}       from '@angular/router';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {Sample, SampleService}   from '../../../services/sample';

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
})

export class SampleDetailComponent implements OnInit, OnDestroy {
    private sample: Sample;
    private sub: any;

    constructor(private route: ActivatedRoute, private router: Router, private service: SampleService) {

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = params['id']; // (+) converts string 'id' to a number
            this.service.getSample(id).then(sample => this.sample = sample);
        });
    }

    getURL() {
        //return "http://" + this.sample.org + "-" + this.sample.env + ".apigee.net/" + this.sample.id;
        return ''
    }

    runTest() {
        // mocha.setup('bdd');
        // assert = chai.assert;
        // parent = this;

        // // let testScript = 'describe(\'Testing \' + this.sample.name, function () {\r\n            describe(\'Calling \' + parent.getURL(), function () {\r\n                it(\'Make 5 API calls, only 2 should succeed\', function (done) {\r\n                    this.timeout(10000);\r\n                    async.times(5, function (n, next) {\r\n                        jQuery.ajax({\r\n                            url: parent.getURL(),\r\n                            complete: function (xhr, statusText) {\r\n                                next(null, xhr.status);\r\n                            }\r\n                        })\r\n                    }, function (cberror, codes) {\r\n                        let success_200 = 0;\r\n                        codes.forEach(function (s) {\r\n                            if (s == 200) {\r\n                                success_200 = success_200 + 1;\r\n                            }\r\n                        });\r\n                        assert.equal(2, success_200);\r\n                        done(cberror);\r\n                    })\r\n                })\r\n            })\r\n        });'
        // // eval(testScript);
        // mocha.globals(['jQuery']);
        // mocha.run();
    }

    deploy() {
        this.service.deploy(this.sample, function (err, data) {
            if (!err) console.log(data)
            else console.log('error occurred ' + err)
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}