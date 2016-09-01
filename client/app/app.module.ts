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
import {MdTabsModule} from '@angular2-material/tabs';

import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {SampleService} from "./services/sample";
import {AuthService} from "./services/auth";
import {TaskService} from "./services/task-service";
import {WindowSize} from "./services/window/window-sizer";
import {WindowService} from "./services/window/window";
import {AuthGuard} from './directives/protected';

// Define the components that will be used
import {SampleDetailComponent} from './components/sample/sample-detail/sample-detail';
import {SampleListComponent} from './components/sample/sample-list/sample-list';
import {AddSampleComponent} from './components/sample/add-sample/add-sample';
import {TaskComponent} from "./components/tasks/tasks";
import {AuthTokenHandler} from './components/auth/access-token-handler';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';

@NgModule({
    declarations: [AppComponent, SampleDetailComponent, SampleListComponent, AddSampleComponent, TaskComponent, AuthTokenHandler],
    imports: [BrowserModule, MdTabsModule, FormsModule, ReactiveFormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig), MdMenuModule],
    providers: [AuthGuard, SampleService, AuthService, TaskService, LocalStorageService, WindowService, WindowSize, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [AppComponent]
})

export class AppModule {

}
