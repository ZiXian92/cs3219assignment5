import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  private subscription: Subscription;
  private isLoggedIn: boolean;
  private githubRepoLink: string;

  constructor(
    private userService: UserService, 
    private githubService: GithubService,
    private router: Router, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.isLoggedIn = this.userService.isLoggedIn();
    console.log(this.isLoggedIn);

    // Check if user is already authenticated
    if(this.isLoggedIn) {
      this.router.navigate(["/setup"]);
    }
  }

  goToGithubAuthentication(): void {
    console.log(this.githubService.getAuthenticationUrl());
    window.location.href = this.githubService.getAuthenticationUrl();
  }
}