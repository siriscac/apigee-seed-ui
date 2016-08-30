/**
 * Created by siriscac on 18/07/16.
 */

import {Routes} from '@angular/router';

import {SampleDetailComponent} from './components/sample/sample-detail/sample-detail';
import {SampleListComponent} from './components/sample/sample-list/sample-list';
import {AddSampleComponent} from './components/sample/add-sample/add-sample';

import {AuthTokenHandler} from './components/auth/access-token-handler';

export const rootRouterConfig: Routes = [
    {path: 'sample/:id', component: SampleDetailComponent},
    {path: 'samples', component: SampleListComponent},
    {path: 'add', component: AddSampleComponent},
    {path: 'login', component: AuthTokenHandler},
    {path: '', redirectTo: 'samples', pathMatch: 'full'}
];

