import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { GithubService } from '../../services/github.service';

import * as _ from 'lodash';

@Component({
    selector: 'contributions',
    templateUrl: 'contributions.component.html'
})
export class ContributionsComponent implements OnInit{
	constructor(
    	private githubService: GithubService
   	) {}

	private barCharts;
	private displayBarCharts;
	private totalContributorsCount;
	private onScreenChart = 1;
	private peopleOnChart = 8;
	private peopleRange = {
		start: null,
		end: null
	}
	private currentChartIndex;
	// Boolean to show data for commits, additions, deletions
	private showData = [true, true, true];

	ngOnInit(): void {
		var type = "contributorsSummary";
		var params = {};
		var apiString = this.githubService.buildApiString(type, params);
		this.githubService.get(apiString)
        .subscribe(function(response) {
        	this.totalContributorsCount = response.length;
    	   	this.barCharts = this.createBarChartData(response);
    	   	var defaultCharts = [];
    	   	for(var i = 0; i < this.barCharts.length && i < this.onScreenChart; i++) {
    	   		defaultCharts.push(this.barCharts[i]);
    	   	}
    	   	this.currentChartIndex = 0;
    	   	this.peopleRange = {
    	   		start: 1,
    	   		end: defaultCharts.length * this.peopleOnChart
    	   	}
    	   	this.updateCharts(defaultCharts);
        }.bind(this));
	}

	public updateCharts(charts) {
		let clone = JSON.parse(JSON.stringify(charts));
		this.displayBarCharts = clone;
	}

	public createBarChartData(contributions) {
		var barCharts = [];
		var barChart;
		for(var i = 0; i < contributions.length; i++) {
			// Start a new set
			if(i % this.peopleOnChart === 0) {
				barChart = {
					index: barCharts.length,
					barChartLabels: [],
					barChartType: 'bar',
					barChartLegend: true,
					barChartData: [{
						data:[],
						label: 'Commits',
					},{
						data:[],
						label: 'Additions',
					},{
						data:[],
						label: 'Deletions'
					}]
				};
				barCharts.push(barChart);
			}
			barChart.barChartLabels.push(contributions[i].contributor);
			barChart.barChartData[0].data.push(contributions[i].commits);
			barChart.barChartData[1].data.push(contributions[i].additions);
			barChart.barChartData[2].data.push(contributions[i].deletions);
		}
		return barCharts;
	}

	public getChartsAtIndex(index, barCharts) {
		var charts = [];
		console.log(barCharts.length);
		for(var i = index; i >= 0 && i < barCharts.length; i++) {
			if(charts.length === this.onScreenChart) {
				break;
			}
			charts.push(barCharts[i]);
		}
		return charts;
	}

	public nextChart() {
		var nextTwoCharts = this.getChartsAtIndex(
					this.currentChartIndex + this.onScreenChart,
					this.barCharts);
		if(nextTwoCharts.length > 0) {
			this.currentChartIndex += this.onScreenChart;
			this.updateCharts(nextTwoCharts);
			this.peopleRange = {
				start: this.currentChartIndex * this.peopleOnChart + 1,
				end: (this.currentChartIndex + nextTwoCharts.length) * this.peopleOnChart
			}
			this.showData = [true, true, true];
		}
	}

	public previousChart() {
		var previousTwoCharts = this.getChartsAtIndex(
					this.currentChartIndex - this.onScreenChart,
					this.barCharts);
		if(previousTwoCharts.length > 0) {
			this.currentChartIndex -= this.onScreenChart;
			this.updateCharts(previousTwoCharts);
			this.peopleRange = {
				start: this.currentChartIndex * this.peopleOnChart + 1,
				end: (this.currentChartIndex + previousTwoCharts.length) * this.peopleOnChart
			}
			this.showData = [true, true, true];
		}
	}

	public toggleData(index) {
		this.showData[index] = !this.showData[index];
		
		// Cannot all don't show
		if(!this.showData[0] && !this.showData[1] && !this.showData[2]) {
			this.showData[index] = !this.showData[index];
			return;	
		}

		if(!this.showData[index]) {
			this.displayBarCharts = this.removeSeries(index, this.displayBarCharts);
		} else {
			this.displayBarCharts = this.addSeries(index, this.displayBarCharts);
		}

		this.updateCharts(this.displayBarCharts);
	}

	public removeSeries(index, displayBarCharts) {
		
		var removeLabel;
		switch(index) {
			case 0:
				removeLabel = "Commits";
			break;
			case 1:
				removeLabel = "Additions";
			break;
			case 2:
				removeLabel = "Deletions";
			break; 
		}

		for(var i = 0; i < displayBarCharts.length; i++) {
			var numberOfData = displayBarCharts[i].barChartData.length;
			for(var j = 0; j < numberOfData; j++) {
				if(displayBarCharts[i].barChartData[j].label === removeLabel) {
					displayBarCharts[i].barChartData.splice(j, 1);
					displayBarCharts[i].barChartData = 
							this.sortByDataType(displayBarCharts[i].barChartData);
					break;
				}
			}
		}
		return displayBarCharts;
	}


	public addSeries(index, displayBarCharts) {
		for(var i = 0; i < displayBarCharts.length; i++) {
			console.log(this.barCharts[displayBarCharts[i].index]);
			
			displayBarCharts[i].barChartData
					.push(this.barCharts[displayBarCharts[i].index].barChartData[index]);
			displayBarCharts[i].barChartData = 
					this.sortByDataType(displayBarCharts[i].barChartData);
					
		}
		return displayBarCharts;
	}

	public sortByDataType(barChartData) {
		var sortedBarChartData = _.sortBy(barChartData, function(o :any) {
			switch(o.label) {
				case "Commits":
					return 0;
				case "Additions":
					return 1;
				case "Deletions":
					return 2;
			}
		});
		return sortedBarChartData;
	}
}