import {Subscription } from 'rxjs';
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

    // Check if user is already authenticated
    if(this.isLoggedIn) {
      this.router.navigate(["/dashboard"]);
    }

    // Attempts to get an authentication code from Github
    this.activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        let githubCode = queryParam['code'];
        // If code is given
        if(githubCode) {
          // Get access token
          this.githubService.getAccessToken(githubCode).then((response) => {
            let accessToken = response;
            // Login and save access token
            this.userService.login(accessToken);

            // Show UI for Github repository link
            this.isLoggedIn = true;
          });
        }
    });
  }

  goToGithubAuthentication(): void {
    window.location.href = this.githubService.getAuthenticationUrl();
  }

  // Sets the Github repository link and redirect to dashboard
  onLinkFormSubmit(): void {
    this.githubService.setGithubRepoLink(this.githubRepoLink);
    this.router.navigate([""])
  }
}