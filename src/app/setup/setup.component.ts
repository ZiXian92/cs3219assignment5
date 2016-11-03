import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'setup',
  templateUrl: 'setup.component.html'
})
export class SetupComponent implements OnInit {

  private subscription: Subscription;
  private isLoggedIn: boolean;
  private githubRepoLink: string;

  constructor(
    private userService: UserService, 
    private githubService: GithubService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Attempts to get token from server
    this.activatedRoute.queryParams.subscribe(
      (queryParam: any) => {
        let token = queryParam['token'];
        // If token is given
        if(token) {
          this.userService.login(token);
        }
    });
  }

  // Sets the Github repository link and redirect to dashboard
  onLinkFormSubmit(): void {
    this.githubService.setGithubRepoLink(this.githubRepoLink);
    this.router.navigate([""])
  }
}