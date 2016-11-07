import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { GithubService } from '../../services/github.service';

import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
    selector: 'commit-history',
    templateUrl: 'commit-history.component.html'
})
export class CommitHistoryComponent implements OnInit {
	constructor(
    private githubService: GithubService
  ) {}

  private memberList: string[];

  private showError: boolean = false;
  private showVisualization: boolean = false;

  private fromDateModel: any;
  private toDateModel: any;

  private selectedMemberList: string[];

  private lineChart;
  private errorMessage;

  ngOnInit(): void {
    this.initializeForm();
    this.getUserList();
  }

  initializeForm() {
    // Initialize From and To to a reasonable date
    var currentDate = new Date();
    var bootstrapFromDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate()
    }
    var bootstrapToDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    }
    this.fromDateModel = bootstrapFromDate;
    this.toDateModel = bootstrapToDate;
    this.selectedMemberList = [];
    this.errorMessage = "Please finish the setup first!"
  }

  getUserList() {
    var type = "contributors";
    var apiString = this.githubService.buildApiString(type, {});
    this.githubService.get(apiString)
    .subscribe(function(response) {
      this.memberList = _.sortBy(response);
    }.bind(this));
  }

  private visualizeCommitHistory(): void {
    if(this.fromDateModel 
        && this.toDateModel 
        && this.selectedMemberList.length > 0 
        && this.validDate(this.makeDate(this.fromDateModel), this.makeDate(this.toDateModel))) {
      this.getContributionsList(this.selectedMemberList, 
          this.makeDate(this.fromDateModel).toISOString(), 
          this.makeDate(this.toDateModel).toISOString());
    } else {
      this.showError = true;
    }
  }

  private getContributionsList(memberList, since, until) {
    
    var observables = [];

    for(var i = 0; i < memberList.length; i++) {
      var type = 'weeklyContributions';
      var params = {
        author: memberList[i].value,
        since: since,
        until: until
      }
      var apiString = this.githubService.buildApiString(type, params);
      observables.push(this.githubService.get(apiString));
    }
    Observable.forkJoin(observables).subscribe(function(response) {
      this.lineChart = this.generateLineData(response);
      this.showVisualization = true;  
    }.bind(this));
  }

  private validDate(fromDate, toDate) {
    // fromDate must be less than toDate
    // fromDate and toDate cannot be in future
    var fromMoment = moment(fromDate);
    var toMoment = moment(toDate);
    var currentMoment = moment(new Date());
    
    if(toMoment.diff(fromMoment) < 0) {
      this.errorMessage = "Date to start checking from has to be less than date to stop checking!"
      return false;
    } else if(currentMoment.diff(toMoment) < 0) {
      this.errorMessage = "Time-travelling is still a science fiction genre!"
      return false;
    } else {
      return true;
    }

  }

  private makeDate(bootStrapDate) {
    var newDate = new Date();
    newDate.setDate(bootStrapDate.day);
    newDate.setMonth(bootStrapDate.month-1);
    newDate.setFullYear(bootStrapDate.year);
    return newDate;
  }

  private goToSetup(): void {
    this.initializeForm();
    this.showVisualization = false;
  }

  private generateLineData(data) {
    console.log(data);
    var lineChart = {
      lineChartData: [],
      lineChartLabels: [],
      lineChartOptions: {
        animation: false,
        responsive: true
      },
      lineChartLegend: true,
      lineChartType: 'line'
    }

    // Get lineChartData
    for(var i = 0; i < data.length; i++) {
      var newSet = {
        data: [],
        label: data[i][0].contributor
      };
      
      var numberOfWeeks = data[i][0].weeks.length;
      for(var j = 0; j < numberOfWeeks; j++) {
        newSet.data.push(data[i][0].weeks[j].commits);
      }
      lineChart.lineChartData.push(newSet);
    }

    // Get Weeks label
    for(var i = 0; i < data[0][0].weeks.length; i++) {
      var date = new Date(data[0][0].weeks[i].from);
      lineChart.lineChartLabels.push(moment(date).format('D/M/Y'));
    }
    return lineChart;
  }
}