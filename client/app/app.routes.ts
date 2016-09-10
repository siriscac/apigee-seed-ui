/**
 * Created by siriscac on 18/07/16.
 */

import {Routes} from '@angular/router';

import {SampleDetailComponent} from './components/sample/sample-detail/sample-detail';
import {SampleListComponent} from './components/sample/sample-list/sample-list';
import {AddSampleComponent} from './components/sample/add-sample/add-sample';
import {MySamplesComponent} from './components/sample/my-samples/my-samples';

import {AuthTokenHandler} from './components/auth/access-token-handler';
import {TaskComponent} from "./components/tasks/tasks";

export const rootRouterConfig: Routes = [
    {path: 'sample/:id', component: SampleDetailComponent},
    {path: 'samples', component: SampleListComponent},
    {path: 'add', component: AddSampleComponent},
    {path: 'mycontrib', component: MySamplesComponent},
    {path: 'login', component: AuthTokenHandler},
    {path: 'tasks', component: TaskComponent},
    {path: '', redirectTo: 'samples', pathMatch: 'full'}
];

