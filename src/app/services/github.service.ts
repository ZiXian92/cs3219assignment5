import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class GithubService implements OnInit {

  constructor(private http: Http) {}

  private githubRepoLink: string;
  private token: string;

  private SERVER_API = {
    serverUrl: "http://localhost:7777/api",
    contributors: "/contributors/owner/repo",
    contributorsSummary: "/contributors/owner/repo/summary",
    weeklyContributions: "/contributors/owner/repo/weekly",
    fileListing: "/trees/owner/repo?branch=",
    detailedCommits: "/commits/owner/repo/changes?branch=&path=&author=&since=&until="
  }

  private GITHUB_API = {
    authenticationUrl: "https://github.com/login/oauth/authorize?",
    githubClientId: "2863ec632b3f7cad7e6f"
  };

  // Expose an observable for our githubRepoLink using Rxjs' BehaviorSubject
  private githubRepoLinkSource = new Subject<string>();
  githubRepoLink$ = this.githubRepoLinkSource.asObservable();

  ngOnInit(): void {
    this.updateGithubRepoLink(this.githubRepoLink);
  }

  getAuthenticationUrl() {
    return this.GITHUB_API.authenticationUrl
        + "client_id=" + this.GITHUB_API.githubClientId;
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

  setToken(token: string): void {
    this.token = token;
  }

  callApi(apiString: string): Observable<any> {
    return this.http.get(apiString)
    .map(function(response) {
      return response.json() || { };
    });
  }

}