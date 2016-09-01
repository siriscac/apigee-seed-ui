/**
 * Created by siriscac on 18/07/16.
 */

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {Config} from "./config/config";
import {enableProdMode} from "@angular/core";

if(Config.isProd){
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
