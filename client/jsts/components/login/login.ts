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
	}
	onSubmit() {
		// request using the fetch api as it is a part of new es6
		window.fetch('https://' + location.host + '/userapi/sessions/create', {
			method: 'POST',
			headers: {
				'Accept': 'text/plain',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: this.username, password: this.password })
		}).then(response => {
			// convert to Text
			return response.text();
		}).then(message => {
			if (message == 'fail') {
				alert('Something serious went wrong');
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
			}
			else if (message == "Wrong password provided" || message == "No such user exists") {
				alert(message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
			}
			else {
				// store the jwt
				localStorage.setItem('jwt', message);
				// navigate to the dashboard
				this.router.navigateByUrl('/dashboard');
			}
		}).catch(error=> {
			// remove jwt for security purpose
			localStorage.removeItem('jwt');
			// log the error message
			console.log(error.message);
		});
	}
}