import { Component } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
    selector: 'contributions',
    templateUrl: 'contributions.component.html'
})
export class ContributionsComponent{
	constructor(
   	) {}

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
		console.log(e);
	}

	public chartHovered(e:any):void {
		console.log(e);
	}

}