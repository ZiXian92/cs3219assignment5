import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {}

  canActivate() {
  	var loggedIn = this.user.isLoggedIn();
  	if(!loggedIn) {
    	this.router.navigate(['/login']);
  	}
  	return loggedIn;
  }
}