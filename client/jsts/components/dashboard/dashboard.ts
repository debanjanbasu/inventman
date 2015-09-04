/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';
@Component({
	selector: 'dashboard-app'
})
@View({
	templateUrl: './jsts/components/dashboard/dashboard.html',
	styleUrls: ['./jsts/components/dashboard/dashboard.css']
})
export class DashboardApp {
	constructor(public router: Router) {
		Waves.attach('.button', ['waves-button']);
		Waves.init();
	}
	logOut() {
		// remove the local stored JWT
		localStorage.removeItem('jwt');
		// route to the login page
		this.router.navigate('/login');
	}
	forceSyncDB() {
		console.log('syncing the database...');
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			window.fetch('https://' + location.host + '/inventmanapi/syncdb', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to JSON
				return response.json();
			}).then(json => {
				if (json.status == 'success') {
					console.log('success');
				}
				else if (json.status == 'failure') {
					console.log('failure');
				}
			}).catch(error=> {
				console.log(error.message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
				// navigate to login
				this.router.navigate('/login');
			});
		}
		else {
			// there is no jwt at all so navigate to login
			this.router.navigate('/login');
			// remove the JWT
			localStorage.removeItem('jwt');
		}
	}
}