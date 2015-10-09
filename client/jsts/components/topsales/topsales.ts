/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {TopSalesPi} from './topsalespi/topsalespi';
@Component({
	selector: 'topsales-widget'
})
@View({
	templateUrl: './jsts/components/topsales/topsales.html',
	styleUrls: ['./jsts/components/topsales/topsales.css'],
	directives: [TopSalesPi]
})
export class TopSalesWidget {
	graphData: any;
	constructor(public router: Router) {
		console.log('Constructing the initial Top 10 Sales Data...');
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			// start the actual thing
			window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/7', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.json();
			}).then(salesdata => {
				// assign the data to graphdata
				this.graphData = salesdata;
			}).catch(error=> {
				console.log(error.message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
				// navigate to login
				this.router.navigateByUrl('/login');
			});
		}
		else {
			// remove the JWT
			localStorage.removeItem('jwt');
			// there is no jwt at all so navigate to login
			this.router.navigateByUrl('/login');
		}
	}
	// function called when select field is selected
	selectPeriod(value) {
		console.log('Constructing the ' + value + ' Top 10 Sales Data...');
		// check if there is a jwt
		let period = -1;
		// reset the period
		switch (value) {
			case 'weekly':
				period = 7;
				break;
			case 'monthly':
				period = 30;
				break;
			case 'annually':
				period = 365;
				break;
			case 'max':
				period = -1;
				break;
			default:
				period = -1;
				break;
		};
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			// start the actual thing
			window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/' + period, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.json();
			}).then(salesdata => {
				// assign the data to graphdata
				this.graphData = salesdata;
			}).catch(error=> {
				console.log(error.message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
				// navigate to login
				this.router.navigateByUrl('/login');
			});
		}
		else {
			// remove the JWT
			localStorage.removeItem('jwt');
			// there is no jwt at all so navigate to login
			this.router.navigateByUrl('/login');
		}
	}
}