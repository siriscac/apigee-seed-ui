export class Config {
    public static oAuthTokenURL: string = "https://login.apigee.com/oauth/authorize?client_id=apigee-seed&response_type=token&redirect_uri=http://localhost:3000/";
    public static oAuthCallbackURL: string = "http://localhost:3000/login";
    public static isProd: boolean = false;
    public static registryURL: string = "http://localhost:5000";
    public static edgeBaseAPI: string = "https://api.enterprise.apigee.com/v1";
}
