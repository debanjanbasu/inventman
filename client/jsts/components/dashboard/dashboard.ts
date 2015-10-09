/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
'use strict';
import {Component, View, NgClass} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {SalesforceWidget} from '../salesforce/salesforce';
import {TopSalesWidget} from '../topsales/topsales';
@Component({
	selector: 'dashboard-app'
})
@View({
	templateUrl: './jsts/components/dashboard/dashboard.html',
	styleUrls: ['./jsts/components/dashboard/nav.css', './jsts/components/dashboard/grid.css'],
	directives: [NgClass, SalesforceWidget, TopSalesWidget]
})
export class DashboardApp {
	classMap1: any = { 'fa-database': true };
	classMap2: any = { 'fa-google': true };
	constructor(public router: Router) {
		$(".gridster > ul").gridster({
			widget_margins: [10, 10],
			widget_base_dimensions: [100, 100],
			resize: {
				enabled: true
			},
			helper: 'clone',
			autogrow_cols: true,
			min_cols: 12
		});
	}
	logOut() {
		// remove the local stored JWT
		localStorage.removeItem('jwt');
		// route to the login page
		this.router.navigateByUrl('/login');
	}
	forceSyncDB() {
		console.log('syncing the database...');
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			// start the actual thing
			this.classMap1 = { 'fa-spinner': true, 'fa-pulse': true };
			window.fetch('https://' + location.host + '/inventmanapi/syncdb', {
				method: 'GET',
				headers: {
					'Accept': 'text/plain',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.text();
			}).then(message => {
				// interprete the message
				console.log(message);
				if (message == "success") {
					alert('Successfully Synced the DB');
					this.classMap1 = { 'fa-database': true };
				}
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
	forceSyncGSheet() {
		console.log('syncing the Google Spreadsheet...');
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			// start the actual thing
			this.classMap2 = { 'fa-spinner': true, 'fa-pulse': true };
			window.fetch('https://' + location.host + '/inventmanapi/syncgsheet', {
				method: 'GET',
				headers: {
					'Accept': 'text/plain',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.text();
			}).then(message => {
				// interprete the message
				console.log(message);
				if (message == "success") {
					alert('Successfully Synced the Google Sheets but the procees may be still going in the background as Google API takes long to sync');
					this.classMap2 = { 'fa-google': true };
				}
			}).catch(error=> {
				console.log(error.message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
				// navigate to login
				this.router.navigateByUrl('/login');
			});
		}
		else {
			// there is no jwt at all so navigate to login
			this.router.navigateByUrl('/login');
			// remove the JWT
			localStorage.removeItem('jwt');
		}
	}
}