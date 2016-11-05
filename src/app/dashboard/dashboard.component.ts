import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { GithubService } from '../services/github.service';

import { State } from '../class/state';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit{
	constructor(
    	private userService: UserService,
    	private githubService: GithubService,
    	private router: Router
   	) {
		githubService.githubRepoLink$.subscribe(
			(githubRepoLink: string) => {
                this.githubService.updateFinalData();
				router.navigate(['']);
			}
		);
        Chart.defaults.global.scaleFontSize = 16;
   	}

    ngOnInit() {
        this.githubService.updateFinalData();
    }

   	// List of states to pass into sidebar
    private stateList:[State] = [{
        route: "contributions",
        name: "Contributions",
        icon: "supervisor_account"
    }, {
        route: "commit-history",
        name: "Commit History",
        icon: "alarm"
    }, {
        route: "file-history",
        name: "File History",
        icon: "insert_drive_file"
    }, {
        route: "final",
        name: "Final",
        icon: "pie_chart"
    }, {
        route: "subscribe",
        name: "Subscribe",
        icon: "notifications"
    }];

	private activeState: State;
}