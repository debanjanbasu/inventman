/// <reference path="../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View, bootstrap} from 'angular2/angular2';
import {routerInjectables, RouterOutlet, RouteConfig} from 'angular2/router';
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
	{ path: '/', redirectTo: '/login' },
	{ path: '/dashboard', as: 'dashboard', component: DashboardApp },
	{ path: '/login', as: 'login', component: LoginApp }
])
// Component controller
export class InventmanApp {
	constructor() {
	}
}

// bootstrap the Main App
bootstrap(InventmanApp,
	[
		routerInjectables
	]);