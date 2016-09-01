import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class DeployService {

    progressObserver: any;
    progress: any;
    public progress$: any;
    logs: any = "Click deploy to start the deployment process";

    public getLogs(){
        return this.logs;
    }

    constructor() {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    public clean (url: string, token: string) : Observable<any> {
        return Observable.create(observer => {

            this.logs = "Cleanup in progress";
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let elt in xhr) {
                console.log('-elt = ' + elt);
            }
            console.log(xhr);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.onprogress = (event) => {
                this.progress = event.loaded;
                this.logs = xhr.responseText;
                this.progressObserver.next(xhr.responseText);
            };

            xhr.open('DELETE', url, true);
            xhr.setRequestHeader("Authorization", token);
            xhr.send();
        });
    }

    public deploy(url: string, token: string): Observable<any> {
        return Observable.create(observer => {

            this.logs = "Deployment in progress";
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let elt in xhr) {
                console.log('-elt = ' + elt);
            }
            console.log(xhr);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.onprogress = (event) => {
                this.progress = event.loaded;
                this.logs = xhr.responseText;
                this.progressObserver.next(xhr.responseText);
            };

            xhr.open('POST', url, true);
            xhr.setRequestHeader("Authorization", token);
            xhr.send();
        });
    }
}
