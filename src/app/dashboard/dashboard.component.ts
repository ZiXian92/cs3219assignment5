import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GithubService } from '../services/github.service';

import { State } from '../class/state';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
	constructor(
    	private userService: UserService,
    	private githubService: GithubService,
    	private router: Router
   	) {
		githubService.githubRepoLink$.subscribe(
			(githubRepoLink: string) => {
				console.log("You update GithubRepoLink?!");
				router.navigate(['dashboard']);
			}
		)
   	}

   	// List of states to pass into sidebar
    private stateList:[State] = [{
        route: "contributions",
        name: "Contributions"
    }, {
        route: "commit-history",
        name: "Commit History"
    }, {
        route: "file-history",
        name: "File History"
    }, {
        route: "subscribe",
        name: "Subscribe"
    }];

	private activeState: State;
}