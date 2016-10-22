import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs';
import { secret } from '../app.secret';

@Injectable()
export class GithubService implements OnInit {

  constructor(private http: Http, private secret: secret) {}

  private githubRepoLink: string;

  private GITHUB_API = {
    authenticationUrl: "https://github.com/login/oauth/authorize?"
  };

  // Expose an observable for our githubRepoLink using Rxjs' BehaviorSubject
  private githubRepoLinkSource = new Subject<string>();
  githubRepoLink$ = this.githubRepoLinkSource.asObservable();

  ngOnInit(): void {
    this.updateGithubRepoLink(this.githubRepoLink);
  }

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
    this.updateGithubRepoLink(githubRepoLink);
  }

  getGithubRepoLink(): string {
    return this.githubRepoLink;
  }

  updateGithubRepoLink(githubRepoLink: string): void {
    if(githubRepoLink) {
      this.githubRepoLinkSource.next(githubRepoLink);  
    }
  }
}