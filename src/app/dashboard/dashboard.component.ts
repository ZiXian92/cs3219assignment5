import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'dashboard',
    template: `
    	<h1>Dashboard</h1>
    	<button (click)="logout()">Logout</button>
    `
})
export class DashboardComponent{
	constructor(
    	private userService: UserService,
    	private router: Router
   	) {}

	logout(): void {
		this.userService.logout();
		this.router.navigate(['login']);
	}

}