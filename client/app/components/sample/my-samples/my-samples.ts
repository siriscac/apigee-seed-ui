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
    templateUrl: 'my-samples.html',
    styleUrls: ['my-samples.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        MD_GRID_LIST_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [SampleService]
})

export class MySamplesComponent implements OnInit, OnDestroy {
    private samples: Sample[];
    private selectedId: any;
    private sub: any;
    private show_spinner: boolean = false;
    constructor(private service: SampleService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = params['id'];
                this.service.getSamples()
                    .then(samples => this.samples = samples);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    isSelected(sample: Sample) {
        return sample.id === this.selectedId;
    }

    onSelect(sample: Sample) {
        //this is just for the hack, fix the createsample with promise        
        this.service.genericCallback = (error, data) => {};

        this.show_spinner = true
        this.service.deleteSample(sample)
            .then( (res) => {
                for(let s in this.samples){
                        var temp = this.samples[s]
                        if(temp.id == sample.id){
                            delete this.samples[s]
                            break
                        }
                }
                console.log('creating the sample now')
                return this.service.createSample(sample)
            }).then( (res) => {      
                this.show_spinner = false          
                this.router.navigate(['/mycontrib']);
            })
            .catch( (err) => {
                this.show_spinner = false
                console.log('Delete failed')                
                console.log(err)

            })        
    }

}
