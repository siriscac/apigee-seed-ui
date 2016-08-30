/**
 * Created by siriscac on 18/07/16.
 */

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    template: '<div class="loader"> <div class="loader__figure"></div></div>'
})

export class AuthTokenHandler {
    private auth_token: string;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.auth_token = params['access_token'];
            console.log(this.auth_token);
        });
    }
}