/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';
@Component({
	selector: 'login-app'
})
@View({
	templateUrl: './jsts/components/login/login.html',
	directives: [FORM_DIRECTIVES],
	styleUrls: ['./jsts/components/login/login.css']
})
export class LoginApp {
	username: String;
	password: String;
	constructor(public router: Router) {
		Waves.attach('.button', ['waves-button']);
		Waves.init();
	}
	onSubmit() {
		// request using the fetch api as it is a part of new es6
		window.fetch('https://' + location.host + '/userapi/sessions/create', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: this.username, password: this.password })
		}).then(response => {
			// convert to JSON
			return response.json();
		}).then(json => {
			if (json.message) {
				alert(json.message);
			} else if (json.id_token) {
				// store the jwt
				localStorage.setItem('jwt', json.id_token);
				// navigate to the dashboard
				this.router.navigate('/dashboard');
			}
		}).catch(error=> {
			console.log(error.message);
		});
	}
}