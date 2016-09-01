/**
 * Created by siriscac on 18/07/16.
 */

import {Injectable, EventEmitter} from "@angular/core";
import {Http, Headers} from "@angular/http";

import {JwtHelper} from 'angular2-jwt';
import {LocalStorage} from "angular2-localstorage/WebStorage";

import {Config} from "../../config/config";
import {WindowService} from "./window/window.ts";


@Injectable()
export class AuthService {
    private oAuthCallbackURL: string = Config.oAuthCallbackURL;
    private oAuthTokenURL: string = Config.oAuthTokenURL;
    private registryURL: string = Config.registryURL;
    private edgeBaseAPI: string = Config.edgeBaseAPI;

    private authenticated: boolean = false;
    private userInfo: any = {};
    private windowHandle: any = null;
    private intervalID: any = null;
    private expiresTimerID: any = null;
    private loopCount = 600;
    private intervalLength = 100;

    private jwtHelper: JwtHelper = new JwtHelper();
    private locationWatcher = new EventEmitter();  // @TODO: switch to RxJS Subject instead of EventEmitter

    @LocalStorage() private token: string;
    @LocalStorage() private expires: any = 0;
    @LocalStorage() private userOrgs: any = {};
    @LocalStorage() private selectedOrg: string;
    @LocalStorage() private selectedEnv: string;

    constructor(private windows: WindowService, private http: Http) {
        var timeDiff = this.expires - (new Date().getTime());
        timeDiff = Math.round(timeDiff / 1000);
        if (timeDiff > 0) {
            this.authenticated = true;
            this.startExpiresTimer(timeDiff);
            this.emitAuthStatus(true);
            this.fetchUserInfo();
        }
    }

    public doLogin() {
        var loopCount = this.loopCount;
        this.windowHandle = this.windows.createWindow(this.oAuthTokenURL, 'OAuth2 Login');

        this.intervalID = setInterval(() => {
            if (loopCount-- < 0) {
                clearInterval(this.intervalID);
                this.emitAuthStatus(false);
                this.windowHandle.close();
            } else {
                var href: string;
                try {
                    href = this.windowHandle.location.href;
                } catch (e) {
                    //console.log('Error:', e);
                }
                if (href != null) {
                    var re = /access_token=(.*)/;
                    var found = href.match(re);
                    if (found) {
                        //console.log("Callback URL:", href);
                        clearInterval(this.intervalID);
                        var parsed = this.parse(href.substr(this.oAuthCallbackURL.length + 1));
                        var expiresSeconds = Number(parsed.expires_in) || 1800;

                        this.token = parsed.access_token;
                        if (this.token) {
                            this.authenticated = true;
                            this.startExpiresTimer(expiresSeconds);
                            this.expires = new Date();
                            this.expires = this.expires.setSeconds(this.expires.getSeconds() + expiresSeconds);

                            this.windowHandle.close();
                            this.emitAuthStatus(true);
                            this.loginUserToRegistry();
                            this.fetchUserInfo();
                            this.fetchUserOrgs();
                        } else {
                            this.authenticated = false;
                            this.emitAuthStatus(false);
                        }

                    } else {
                        if (href.indexOf(this.oAuthCallbackURL) == 0) {
                            clearInterval(this.intervalID);
                            var parsed = this.parse(href.substr(this.oAuthCallbackURL.length + 1));
                            this.windowHandle.close();
                            this.emitAuthStatusError(false, parsed);
                        }
                    }
                }
            }
        }, this.intervalLength);
    }

    public doLogout() {
        this.authenticated = false;
        this.expiresTimerID = null;
        this.expires = 0;
        this.token = null;
        this.emitAuthStatus(true);
        console.log('Session data has been cleared');
    }

    private emitAuthStatus(success: boolean) {
        this.emitAuthStatusError(success, null);
    }

    private emitAuthStatusError(success: boolean, error: any) {
        this.locationWatcher.emit(
            {
                success: success,
                authenticated: this.authenticated,
                token: this.token,
                expires: this.expires,
                error: error
            }
        );
    }

    private loginUserToRegistry() {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${this.token}`);

        this.http.post(this.registryURL + "/user", '', {headers: headers})
            .subscribe(
                data => {
                    console.log(data);
                },
                err => {
                    console.log(err.json().message);
                });
    }

    private fetchUserInfo() {
        if (this.token != null) {
            let data = this.jwtHelper.decodeToken(this.token);
            this.userInfo.user_name = data.user_name;
            this.userInfo.user_id = data.user_id;
            this.userInfo.user_email = data.email;
        }
    }

    private fetchUserOrgs() {
        if (this.token != null) {
            var headers = new Headers();
            headers.append('Authorization', `Bearer ${this.token}`);
            //noinspection TypeScriptUnresolvedFunction
            this.http.get(this.edgeBaseAPI + "/users/" + this.getUserEmail() + "/userroles", {headers: headers})
                .map(res => res.json())
                .subscribe(info => {
                    this.userOrgs = info;
                    if (!this.selectedOrg) {
                        this.selectedOrg = this.userOrgs.role[0].organization;
                        this.selectedEnv = "test";
                    }

                }, err => {
                    console.error("Failed to fetch user orgs:", err);
                });
        }
    }

    private fetchConfig() {
        this.http.get(this.registryURL + "/ssoconfig")
            .map(res => res.json())
            .subscribe(config => {
                this.oAuthTokenURL = config.oAuthTokenURL;
                this.oAuthCallbackURL = config.oAuthCallbackURL;
            }, err => {
                console.error("Failed to fetch config:", err);
            });
    }

    public getToken() {
        return this.token;
    }

    public getSession() {
        return {authenticated: this.authenticated, token: this.token, expires: this.expires};
    }

    public getUserInfo() {
        return this.userInfo;
    }

    public getUserName() {
        return this.userInfo ? this.userInfo["user_name"].split("@")[0] : null;
    }

    public getUserEmail() {
        return this.userInfo ? this.userInfo["user_email"] : null;
    }

    public getUserOrgs() {
        return this.userOrgs ? this.userOrgs.role : null;
    }

    public getSelectedOrg() {
        return this.selectedOrg;
    }

    public getSelectedEnv() {
        return this.selectedEnv;
    }

    public setSelectedOrg(org: string) {
        this.selectedOrg = org;
    }

    public setSelectedEnv(env: string) {
        this.selectedEnv = env;
    }

    private startExpiresTimer(seconds: number) {
        if (this.expiresTimerID != null) {
            clearTimeout(this.expiresTimerID);
        }
        this.expiresTimerID = setTimeout(() => {
            console.log('Session has expired');
            this.doLogout();
        }, seconds * 1000); // seconds * 1000
        console.log('Token expiration timer set for', seconds, "seconds");
    }

    public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
        return this.locationWatcher.subscribe(onNext, onThrow, onReturn);
    }

    public isAuthenticated() {
        return this.authenticated;
    }

    private parse(str) { // lifted from https://github.com/sindresorhus/query-string
        if (typeof str !== 'string') {
            return {};
        }

        str = str.trim().replace(/^(\?|#|&)/, '');

        if (!str) {
            return {};
        }

        return str.split('&').reduce(function (ret, param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            // Firefox (pre 40) decodes `%3D` to `=`
            // https://github.com/sindresorhus/query-string/pull/37
            var key = parts.shift();
            var val = parts.length > 0 ? parts.join('=') : undefined;

            key = decodeURIComponent(key);

            // missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            val = val === undefined ? null : decodeURIComponent(val);

            if (!ret.hasOwnProperty(key)) {
                ret[key] = val;
            } else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            } else {
                ret[key] = [ret[key], val];
            }

            return ret;
        }, {});
    };

}

