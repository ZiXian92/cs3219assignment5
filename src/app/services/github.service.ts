import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { secret } from '../app.secret'

@Injectable()
export class GithubService {

  constructor(private http: Http, private secret: secret) {}

  private githubRepoLink: string;

  private GITHUB_API = {
    authenticationUrl: "https://github.com/login/oauth/authorize?"
  };

  getAuthenticationUrl() {
    return this.GITHUB_API.authenticationUrl
        + "client_id=" + this.secret.getGithubClientId();
  }

  getAccessToken(githubCode: string): Promise<string> {
     return new Promise((resolve, reject) => {
       resolve("dummyToken");
     });
  }

  setGithubRepoLink(githubRepoLink: string): void {
    this.githubRepoLink = githubRepoLink;
  }
}