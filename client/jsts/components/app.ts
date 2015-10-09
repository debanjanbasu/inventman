/// <reference path="../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View, bootstrap, bind} from 'angular2/angular2';
import {RouteConfig, Router, ROUTER_DIRECTIVES, APP_BASE_HREF, routerBindings, LocationStrategy, PathLocationStrategy} from 'angular2/router';
import {LoginApp} from './login/login';
import {DashboardApp} from './dashboard/dashboard';
// Annotation section
@Component({
    selector: 'inventman-app'
})
@View({
	template: '<router-outlet></router-outlet>',
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	// { path: '/', redirectTo: '/login' },
	{ path: '/dashboard', as: 'DashboardCmp', component: DashboardApp },
	{ path: '/login', as: 'LoginCmp', component: LoginApp }
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
					'Accept': 'text/plain',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.text();
			}).then(message => {
				if (message == "success") {
					// this is a valid user
					this.router.navigateByUrl('/dashboard');
				}
				else {
					// Invalid Token
					console.log(message);
					// remove jwt for security purpose
					localStorage.removeItem('jwt');
					// navigate to login
					this.router.navigateByUrl('/login');
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

// bootstrap the Main App
bootstrap(InventmanApp, [
	routerBindings(InventmanApp),
	bind(LocationStrategy).toClass(PathLocationStrategy),
	bind(APP_BASE_HREF).toValue('/')]);