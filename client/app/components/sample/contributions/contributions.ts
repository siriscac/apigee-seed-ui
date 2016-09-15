/**
 * Created by siriscac on 21/07/16.
 */

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ROUTER_DIRECTIVES}  from '@angular/router';

import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';

import {SampleService, Sample}   from '../../../services/sample';
import {ToastService} from "../../../services/toast";
import {AuthService} from "../../../services/auth";

@Component({
    templateUrl: 'contributions.html',
    styleUrls: ['contributions.css'],
    directives: [
        MD_CARD_DIRECTIVES,
        MD_GRID_LIST_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [SampleService]
})

export class ContributionsComponent implements OnInit, OnDestroy {
    private samples: Sample[];
    private selectedId: any;
    private sub: any;
    private show_spinner: boolean = false;

    constructor(private service: SampleService, private route: ActivatedRoute, private router: Router, private toast: ToastService, private authService: AuthService) {

    }

    ngOnInit() {
        this.sub = this.route
            .params
            .subscribe(params => {
                this.selectedId = params['id'];
                this.service.getMySamples()
                    .then(samples => this.samples = samples);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    isSelected(sample: Sample) {
        return sample.id === this.selectedId;
    }

    get authenticated(){
        return this.authService.isAuthenticated();
    }

    deleteSample(sample: Sample) {
        let c = confirm("Are you sure you want to delete the sample - " + sample.displayName + "?");
        if (c == true) {
            this.proceedToDelete(sample);
        }
    }

    updateSample(sample: Sample) {
        let c = confirm("Update sample - " + sample.displayName + "?");
        if (c == true) {
            this.toast.showToast("Updating sample - " + sample.displayName);
            this.service.deleteSample(sample)
                .then((res) => {
                    console.log('Creating the sample now');
                    return this.service.createSample(sample);
                })
                .then((res) => {
                    for (let s in this.samples) {
                        var temp = this.samples[s];
                        if (temp.id == sample.id) {
                            delete this.samples[s];
                            break;
                        }
                    }
                    this.toast.showToast(sample.displayName + " was updated successfully");
                    //this.router.navigate(['/contributions']);
                })
                .catch((err) => {
                    console.log('Delete failed');
                    this.toast.showToast(sample.displayName + " update failed");
                    console.log(err);
                });
        }
    }

    proceedToDelete(sample: Sample) {
        this.toast.showToast("Deleting sample - " + sample.displayName + "?");

        this.service.deleteSample(sample)
            .then((res)=> {
                return this.service.getMySamples();
            })
            .then((samples) => {
                this.toast.showToast(sample.displayName + " deleted successfully");
                this.samples = samples;
            });
    }

    openAddSample() {
        this.router.navigate(['/add']);
    }

}
