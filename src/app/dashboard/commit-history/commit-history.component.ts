import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'commit-history',
    templateUrl: 'commit-history.component.html'
})
export class CommitHistoryComponent implements OnInit {
	constructor() {}

 	private memberList: string[] = [
 		"Goku",
 		"Uzumaki Naruto",
 		"Kurosaki Ichigo",
 		"Monkey D. Luffy",
 		"Yugi Muto",
 		"Yoh Asakura",
 		"Hikaru Shindo",
 		"Kenshin",
 		"Allen Walker",
 		"Light Yagami",
 		"Gintoki Sakata",
 		"Gon Freecss",
 		"Tsuna Sawada" 	
 	];

  private showError: boolean = false;
  private showVisualization: boolean = false;

  private fromDateModel: any;
  private toDateModel: any;

  private selectedMemberList: string[] = [];

  ngOnInit(): void {
    // Initialize From and To to a reasonable date
    var currentDate = new Date();
    var bootstrapCurrentDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDay()
    }
    this.fromDateModel = bootstrapCurrentDate;
    this.toDateModel = bootstrapCurrentDate;
  }

  private visualizeCommitHistory(): void {
    console.log(this.fromDateModel);
    console.log(this.toDateModel);
    console.log(this.selectedMemberList);
    if(this.fromDateModel && this.toDateModel
          && this.selectedMemberList.length > 0) {
      this.showVisualization = true;
    } else {
      this.showError = true;
    }
  }

  private goToSetup(): void {
    this.showVisualization = false;
  }

  // Line Chart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
}