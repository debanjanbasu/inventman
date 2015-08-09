/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
@Component({
	selector: 'dashboard-app'
})
@View({
	templateUrl: './jsts/components/dashboard/dashboard.html',
	styleUrls: ['./jsts/components/dashboard/dashboard.css']
})
export class DashboardApp {
	constructor() {

	}
}