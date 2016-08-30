/**
 * Created by siriscac on 18/07/16.
 */

import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {MdMenuModule} from '@angular2-material/menu';
import {LocalStorageService} from 'angular2-localstorage/LocalStorageEmitter';

import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {SampleService} from "./services/sample";
import {AuthService} from "./services/auth";
import {WindowSize} from "./services/window-sizer";
import {WindowService} from "./services/window";
import {AuthGuard} from './directives/protected';

// Define the components that will be used
import {SampleDetailComponent} from './components/sample/sample-detail/sample-detail';
import {SampleListComponent} from './components/sample/sample-list/sample-list';
import {AddSampleComponent} from './components/sample/add-sample/add-sample';
import {AuthTokenHandler} from './components/auth/access-token-handler';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';

@NgModule({
    declarations: [AppComponent, SampleDetailComponent, SampleListComponent, AddSampleComponent, AuthTokenHandler],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig), MdMenuModule],
    providers: [AuthGuard, SampleService, AuthService, LocalStorageService, WindowService, WindowSize, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [AppComponent]
})

export class AppModule {

}