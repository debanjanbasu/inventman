/// <reference path="../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View, bootstrap} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, ROUTER_BINDINGS} from 'angular2/router';
import {LoginApp} from './login/login';
import {DashboardApp} from './dashboard/dashboard';
// Annotation section
@Component({
    selector: 'inventman-app'
})
@View({
    template: `<!-- The router-outlet displays the template for the current component based on the URL -->
    <router-outlet></router-outlet>`,
    directives: [RouterOutlet]
})
@RouteConfig([
	// { path: '/', redirectTo: '/login' },
	{ path: '/dashboard', as: 'dashboard-app', component: DashboardApp },
	{ path: '/login', as: 'login-app', component: LoginApp }
])
// Component controller
class InventmanApp {
	constructor(public router: Router) {
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			window.fetch('https://' + location.host + '/inventmanapi/me', {
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
				if (json.username) {
					// this is a valid user
					this.router.navigate('/dashboard');
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

// bootstrap the Main App
bootstrap(InventmanApp, [
	ROUTER_BINDINGS]);