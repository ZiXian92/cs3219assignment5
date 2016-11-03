import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { GithubService } from '../../services/github.service';

@Component({
    selector: 'contributions',
    templateUrl: 'contributions.component.html'
})
export class ContributionsComponent implements OnInit{
	constructor(
    	private githubService: GithubService
   	) {}

	ngOnInit(): void {
		var type = "contributors";
		var params = {};
		var apiString = this.githubService.buildApiString(type, params);
		console.log(apiString);
		
		var type = "contributorsSummary";
		var apiString = this.githubService.buildApiString(type, params);
		console.log(apiString);
		
		var type = "weeklyContributions";
		var myApiString = this.githubService.buildApiString(type, params);
		console.log(apiString);
		
		var type = "fileListing";
		var fileParams = {branch: "master"};
		var myApiString = this.githubService.buildApiString(type, fileParams);
		console.log(myApiString);
		
		var type = "detailedCommits";
		var commitParams = {
			branch: "branchName",
			path: "pathName",
			author: "authorName",
			since: "sinceName",
			until: "untilName"
		};
		var apiString = this.githubService.buildApiString(type, commitParams);
		console.log(apiString);
		
		console.log('Calling Api with ' + myApiString);
		this.githubService.callApi(myApiString)
        .subscribe(function(response) {
    	   	console.log(response);
        });

	}

	// Bar chart
	public barChartOptions:any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	public barChartData:any[] = [
		{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
		{data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
	];

	// Pie chart
	public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
	public pieChartData:number[] = [300, 500, 100];
	public pieChartType:string = 'pie';

	// events
	public chartClicked(e:any):void {
		//console.log(e);
	}

	public chartHovered(e:any):void {
		//console.log(e);
	}
}