import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
    selector: 'titlebar',
    templateUrl: 'titlebar.component.html'
})
export class TitlebarComponent implements OnInit{
	constructor(
   		private githubService: GithubService
   	) {}

	private githubRepoLink: string;
	private isEdit = false;

	ngOnInit(): void {
		this.githubRepoLink = this.githubService.getGithubRepoLink();
		console.log(this.githubRepoLink)
	}

	editGithubRepoLink(): void {
		this.isEdit = true;
	}

	setGithubRepoLink(): void {
		this.isEdit = false;
		this.githubService.setGithubRepoLink(this.githubRepoLink);
	}
}