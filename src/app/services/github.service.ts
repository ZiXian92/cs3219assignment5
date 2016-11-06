import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class GithubService implements OnInit {

  constructor(private http: Http, private userService: UserService) {}

  private githubRepoLink: string = "https://github.com/tungnk1993/scrapy";
  private githubOwner: string  = "kylelwm";
  private token: string;
  private finalData;

  private SERVER_API = {
    serverUrl: "http://localhost:7777/api",
    contributors: "/contributors/{{owner}}/{{repo}}",
    contributorsSummary: "/contributors/{{owner}}/{{repo}}/summary",
    weeklyContributions: "/contributors/{{owner}}/{{repo}}/weekly",
    fileListing: "/trees/{{owner}}/{{repo}}",
    detailedCommits: "/commits/{{owner}}/{{repo}}/changes",
    subscribe: "/subscribe",
    final: "/final/{{owner}}/{{repo}}"
  }

  private GITHUB_API = {
    authenticationUrl: "https://github.com/login/oauth/authorize?",
    githubClientId: "2863ec632b3f7cad7e6f"
  };

  // Expose an observable for our githubRepoLink using Rxjs' BehaviorSubject
  private githubRepoLinkSource = new Subject<string>();
  githubRepoLink$ = this.githubRepoLinkSource.asObservable();
  private finalDataSource = new Subject<any>();
  finalData$ = this.finalDataSource.asObservable();

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

  getFinalData(): void {
    return this.finalData;
  }

  updateFinalData(): void {
    this.finalData = null;
    var type = "final";
    var apiString = this.buildApiString(type, {});
    this.get(apiString)
    .subscribe(function(response) {
      if(response) {
        this.finalData = response;
        this.finalDataSource.next(response);
      }
    }.bind(this));
  }

  getGithubRepoLink(): string {
    return this.githubRepoLink;
  }

  updateGithubRepoLink(githubRepoLink: string): void {
    if(githubRepoLink) {
      this.githubRepoLinkSource.next(githubRepoLink);
    }
  }

  getOwnerOfRepo(githubRepoLink) :string {
    var prefix = "https://github.com/";
    var endingSlash = "/";
    if(githubRepoLink.indexOf(prefix) == 0) {
      var intermediateString = githubRepoLink.substring(prefix.length);
      if(intermediateString.indexOf(endingSlash) >= 0) {
        var ownerNameLength = intermediateString.indexOf(endingSlash);
        var ownerName = intermediateString.substring(0, ownerNameLength);
        return ownerName;
      }
    }
    return null;
  }

  getRepoName(githubRepoLink) :string {
    var prefix = "https://github.com/";
    var endingSlash = "/";
    if(githubRepoLink.indexOf(prefix) == 0) {
      var intermediateString = githubRepoLink.substring(prefix.length);
      if(intermediateString.indexOf(endingSlash) >= 0) {
        var ownerNameLength = intermediateString.indexOf(endingSlash);
        intermediateString = intermediateString.substring(ownerNameLength);
        if(intermediateString.indexOf(endingSlash) >= 0) {
          var repoNameStart = intermediateString.indexOf(endingSlash) + 1;
          var repoName = intermediateString.substring(repoNameStart);
          return repoName;
        }
      }
    }
    return null;
  }

  insertOwnerAndRepo(apiString) :string {
    if(!this.githubRepoLink) {
      return null;
    }

    let owner = this.getOwnerOfRepo(this.githubRepoLink);
    let repo = this.getRepoName(this.githubRepoLink);

    if(!owner || !repo) {
      return null;
    } else {
      apiString = apiString.replace('{{owner}}', owner);
      apiString = apiString.replace('{{repo}}', repo);
      return apiString;
    }
  }

  insertParam(apiString, urlParamNames, urlParamValues) :string {
    apiString += "?"
    for(var i = 0; i < urlParamNames.length; i++) {
      apiString += urlParamNames[i] + "=" + urlParamValues[i];
      if(i < urlParamNames.length - 1) {
        apiString += "&"
      }
    }
    return apiString;
  }

  buildApiString(type: string, params: any): string {

    var apiString = this.SERVER_API[type];
    var urlParamNames = [];
    var urlParamValues = [];

    if(!apiString) {
      return null;
    }

    apiString = this.insertOwnerAndRepo(apiString);

    if(!apiString) {
      return null;
    }

    switch(type) {
      case 'contributors':
      case 'contributorsSummary':
      case 'subscribe':
      case 'final':
        break;
      case 'weeklyContributions':
        if(!params.author || !params.since || !params.until) {
          return null;
        } else {
          urlParamNames.push("author");
          urlParamValues.push(params.author);

          urlParamNames.push("since");
          urlParamValues.push(params.since);

          urlParamNames.push("until");
          urlParamValues.push(params.until);

          apiString = this.insertParam(apiString, urlParamNames, urlParamValues);
        }
        break;
      case 'fileListing':
        if(!params.branch) {
          return null;
        } else {
          urlParamNames.push("branch");
          urlParamValues.push(params.branch);
          apiString = this.insertParam(apiString, urlParamNames, urlParamValues);
        }
        break;
      case 'detailedCommits':
        if(!params.branch || !params.path) {
          return null;
        } else {
          console.log(params);
          urlParamNames.push("branch");
          urlParamValues.push(params.branch);

          urlParamNames.push("path");
          urlParamValues.push(params.path);

          if(params.author !== null && params.author !== undefined) {
            urlParamNames.push("author");
            urlParamValues.push(params.author);
          }

          if(params.since !== null && params.since !== undefined) {
            urlParamNames.push("since");
            urlParamValues.push(params.since);
          }

          if(params.until !== null && params.until !== undefined) {
            urlParamNames.push("until");
            urlParamValues.push(params.until);
          }

          apiString = this.insertParam(apiString, urlParamNames, urlParamValues);
        }
        break;
    }
    apiString = this.SERVER_API.serverUrl + apiString;
    return apiString;
  }

  get(apiString: string): Observable<any> {

    let options = new RequestOptions();
    this.setToken(options);

    return this.http.get(apiString, options)
    .map(function(response) {
      var result;
      try {
        result = response.json() || { };
      } catch (e) {
        result = response;
      }
      return result;
    });
  }

  post(apiString: string, body: any): Observable<any> {

    let options = new RequestOptions();
    this.setToken(options);

    return this.http.post(apiString, body, options)
    .map(function(response) {
      var result;
      try {
        result = response.json();
      } catch (e) {
        result = {};
      }
      return result;
    });
  }

  setToken(options): any {
    let token = this.userService.getToken();
    if(token) {
      if(!options.header) {
        let headers = new Headers();
        options.headers = headers;
      }
      options.headers.set('Authorization', `token ${token}`);
    }
  }

}
