/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View, formDirectives, Inject} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {HttpService} from '../../services/httpservice/httpservice';
@Component({
	selector: 'login-app'
})
@View({
	templateUrl: './jsts/components/login/login.html',
	directives: [formDirectives],
	styleUrls: ['./jsts/components/login/login.css']
})
export class LoginApp {
	username: String;
	password: String;
	constructor(public router: Router) {
	}
	onSubmit() {
		const username = this.username, password = this.password;
		HttpService.serve('https://' + location.host + '/userapi/sessions/create', 'POST', {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}, JSON.stringify({ username, password }))
			.then(response=> {
				if (!response.id_token) {
					// Alerts the actual message received from the server
					alert(response.message);
					// Removes any previous assigned JWT to ensure tighter security
					localStorage.removeItem('jwt');
				}
				else {
					// Valid Login attempt -> Assign a jwt to the localStorage
					localStorage.setItem('jwt', response.id_token);
					// route to the dashboard
					this.router.parent.navigate('/dashboard');
				}
			});
	}
}