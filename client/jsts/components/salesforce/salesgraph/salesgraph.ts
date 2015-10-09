/// <reference path="../../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
@Component({
	selector: 'sales-graph',
	inputs: ['data']
})
@View({
	template: `<div id="chartdiv"></div>`,
	styleUrls: ['./jsts/components/salesforce/salesgraph/salesgraph.css']
})
export class SalesGraph {
	data: any;
	chart: any;
	myDataSets: any = [];
	constructor() {
		// select the element for graphing
		// the data has not been passed yet
	}

	// function to add data
	addData(sku) {
		// unimplemented will be called by the other component
	}
	// function to remove data
	removeData(sku) {
		// unimplemented will be called by the other component
	}

	onChanges() {
		// a change in value detected for the first time
		if (this.data && this.data[1] && !this.chart) {
			// create the dataset
			let colorsArray = ["#551A8B"];

			for (let i = 0; i < this.data.length; i += 2) {
				let newSet = {
					title: this.data[i],
					fieldMappings: [{
						fromField: "totalvalue",
						toField: "value"
					}, {
							fromField: "qtysales",
							toField: "volume"
						}],
					dataProvider: this.data[i + 1],
					categoryField: "_id",
					color: colorsArray[i]
				};
				this.myDataSets.push(newSet);
			}
			// create the chart
			AmCharts.themes.none = {};
			// reset the axis settings
			let categoryAxesSettings: any = new AmCharts.CategoryAxesSettings();
			categoryAxesSettings.maxSeries = 0;
			this.chart = AmCharts.makeChart("chartdiv", {
				type: "stock",
				"theme": "none",

				dataSets: this.myDataSets,

				panels: [{

					showCategoryAxis: false,
					title: "Value",
					percentHeight: 70,

					stockGraphs: [{
						id: "g1",

						valueField: "value",
						comparable: true,
						compareField: "value",
						balloonText: "[[title]]:<b>[[value]]</b>",
						compareGraphBalloonText: "[[title]]:<b>[[value]]</b>"
					}],

					stockLegend: {
						periodValueTextComparing: "[[percents.value.close]]%",
						periodValueTextRegular: "[[value.close]]"
					}
				},

					{
						title: "Volume",
						percentHeight: 30,
						stockGraphs: [{
							valueField: "volume",
							type: "column",
							showBalloon: false,
							fillAlphas: 1
						}],


						stockLegend: {
							periodValueTextRegular: "[[value.close]]"
						}
					}
				],

				chartScrollbarSettings: {
					graph: "g1"
				},

				chartCursorSettings: {
					valueBalloonsEnabled: true,
					fullWidth: true,
					cursorAlpha: 0.1,
					valueLineBalloonEnabled: true,
					valueLineEnabled: true,
					valueLineAlpha: 0.5
				},

				periodSelector: {
					position: "left",
					periods: [{
						period: "MM",
						count: 1,
						label: "1 month"
					}, {
							period: "YYYY",
							count: 1,
							label: "1 year"
						}, {
							period: "YTD",
							label: "YTD"
						}, {
							period: "MAX",
							selected: true,
							label: "MAX"
						}]
				},

				dataSetSelector: {
					position: "left"
				},
				"export": {
					"enabled": true
				},
				categoryAxesSettings: categoryAxesSettings
			});
		}
	}
	// end of change detection function
}