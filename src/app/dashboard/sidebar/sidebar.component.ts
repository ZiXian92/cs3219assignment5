import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service'
import { State } from '../../class/state'

@Component({
    selector: 'sidebar',
    templateUrl: 'sidebar.component.html'
})
export class SidebarComponent{
	constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
   	) {}

    private stateList:[State] = [
        {
            route: "contributions",
            name: "Contributions"
        },
        {
            route: "commit-history",
            name: "Commit History"
        },{
            route: "file-history",
            name: "File History"
        },{
            route: "subscribe",
            name: "Subscribe"
        },{
            route: "logout",
            name: "Logout"
        }];

    goTo(state:State): void {
        if(state.name === "Logout") {
            console.log('logging out');
            this.userService.logout();
            this.router.navigate(["login"]);
        }

        this.router.navigate([state.route], {relativeTo: this.route});
    }
}