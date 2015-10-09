/// <reference path="../../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {SalesGraph} from '../../salesforce/salesgraph/salesgraph';
@Component({
	selector: 'topsales-pi',
	inputs: ['data']
})
@View({
	template: `<div id="chartdiv2"></div>`,
	styleUrls: ['./jsts/components/topsales/topsalespi/topsalespi.css']
})
export class TopSalesPi {
	data: any;
	chart: any;
	constructor(public router: Router) {
		// select the element for graphing
		// the data has not been passed yet
	}
	// function to add sku dales data
	addData(sku) {
		// still to implement
	}
	// function to remove sku data
	removeData(sku) {
		// still to implement
	}
	// chage detection function
	onChanges() {
		// a change in value detected and check if the chart is already created or not
		if (this.data && !this.chart) {
			// create the dataProvider
			let dataProvider: any = [];
			for (let sku of this.data) {
				dataProvider.push({
					"sku": sku._id.sku,
					"quantity": sku.qtysales,
					"description": '(' + sku._id.name + ') $' + sku.totalvalue
				});
			}
			// create the chart
			AmCharts.themes.none = {};
			this.chart = AmCharts.makeChart("chartdiv2", {
				"type": "pie",
				"theme": "none",
				"titles": [{
					"text": "Top 10 Master SKUs",
					"size": 16
				}],
				"dataProvider": dataProvider,
				"valueField": "quantity",
				"titleField": "sku",
				"descriptionField": "description",
				"startEffect": "elastic",
				"startDuration": 2,
				"labelRadius": 15,
				"innerRadius": "50%",
				"depth3D": 10,
				"balloonText": "[[description]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
				"angle": 15,
				"export": {
					"enabled": true
				},
				"colors": ["#551A8B", "#800080", "#8B008B", "#9932CC", "#9400D3", "#8A2BE2", "#9370DB", "#BA55D3", "#FF00FF", "#DA70D6", "#EE82EE", "#DDA0DD", "#D8BFD8", "#E6E6FA"]
			});
			// add the event listeners
			this.chart.addListener('pullOutSlice', slice => {
				this.addData(slice.dataItem.title);
			});
			this.chart.addListener('pullInSlice', slice => {
				this.removeData(slice.dataItem.title);
			});
		}
		// data changed but chart already exists
		else if (this.data && this.chart) {
			// create the dataProvider
			let dataProvider: any = [];
			for (let sku of this.data) {
				dataProvider.push({
					"sku": sku._id.sku,
					"quantity": sku.qtysales,
					"description": '(' + sku._id.name + ') $' + sku.totalvalue
				});
			}
			// reinitialize the chart
			this.chart.dataProvider = dataProvider;
			this.chart.validateData();
			this.chart.animateAgain();
		}
	}
}