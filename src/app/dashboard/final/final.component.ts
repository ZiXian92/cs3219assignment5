import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

import * as _ from 'lodash';

@Component({
    selector: 'final',
    templateUrl: 'final.component.html'
})
export class FinalComponent implements OnInit {
	constructor(
        private githubService: GithubService
   	) {}

    public loadingFinal = true;
    public finalData = null;
    public displayFinalData = null;
    public topN = 5;
    public pieData;
    public filterKey;
    private sortOption = {
        type: 'name',
        downwards: true
    }

    ngOnInit() {
        this.finalData = this.githubService.getFinalData();
        if(this.finalData) {
            this.initializeVisualization();    
        } else {
            this.githubService.finalData$.subscribe(
                function(finalData: string) {
                    this.finalData = finalData;
                    this.initializeVisualization();
                }.bind(this));
        }
    }

    initializeVisualization() {
        var topNByRows;
        this.loadingFinal = false;
        this.toggleSort('rows');
        topNByRows = this.loadTopNByRows(this.finalData);
        this.pieData = this.generatePieData(topNByRows);
    }

    // Sort and updates the displayFinalData
    toggleSort(type) {
        if(type === this.sortOption.type) {
            this.sortOption.downwards = !this.sortOption.downwards;
        } else {
            this.sortOption.downwards = true;
        }

        var order;

        if(this.sortOption.downwards) {
            if(type === 'name') {
                order = 'asc';
            } else {
                order = 'desc';
            }
        } else {
            if(type === 'name') {
                order = 'desc';
            } else {
                order = 'asc';
            }
        }

        var iteratee;
        switch(type) {
            case 'name':
                iteratee = 'name' 
                break;
            case 'rows':
                iteratee = 'rows' 
                break;
            case 'comments':
                iteratee = 'percentage_in_comments' 
                break;
            case 'stability':
                iteratee = 'stability' 
                break; 
        }
        this.sortOption.type = type;
        this.displayFinalData = _.orderBy(this.finalData, iteratee, order)
    }

    filter(filterKey) {
        if(filterKey) {
            filterKey = filterKey.toLowerCase();
            this.displayFinalData = _.filter(this.finalData, function(o :any) {
                return o.name.toLowerCase().indexOf(filterKey) >= 0 ? true : false
            });
        } else {
            this.displayFinalData = this.finalData;
        }
    }

    loadTopNByRows(finalData) {
        return _.orderBy(finalData, "rows", "desc")
                    .slice(0, this.topN);
    }

    generatePieData(topNByRows) {
        var pieData = {
            pieChartLabels: [],
            pieChartData: [],
            pieChartType: 'pie'
        };
        for(var i = 0; i < this.topN; i++) {
            pieData.pieChartLabels.push(topNByRows[i].name);
            pieData.pieChartData.push(topNByRows[i].rows);
        }
        return pieData;
    }
 }