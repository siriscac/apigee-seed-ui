/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES}  from '@angular/router';

import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {SampleService, Sample}   from '../../../services/sample';


@Component({
    templateUrl: 'sample-list.html',
    styleUrls: ['sample-list.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        MD_GRID_LIST_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [SampleService]
})

export class SampleListComponent implements OnInit, OnDestroy {
    private samples: any = {};
    private selectedId: any;
    private sub: any;
    private sections = ["security", "solution", "traffic-management"];

    constructor(private service: SampleService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = params['id'];
                this.service.getSamples()
                    .then(samples => {
                        this.samples = samples;
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    isSelected(sample: Sample) {
        return sample.id === this.selectedId;
    }

    onSelect(sample: Sample) {
        this.router.navigate(['/sample', sample.name]);
    }

    scrollTo(section) {
        console.log(section);
        document.getElementById(section).scrollIntoView();
    }
}
