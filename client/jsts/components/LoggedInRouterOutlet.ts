/// <reference path="../typings/angular2/angular2.d.ts" />
'use strict';
import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/angular2';
import {Router, RouterOutlet} from 'angular2/router';
import {LoginApp} from './login/login';
import {HttpService} from '../services/httpservice/httpservice';
@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  username: String;
  constructor(public _elementRef: ElementRef, public _loader: DynamicComponentLoader,
    public _parentRouter: Router, @Attribute('name') nameAttr: string) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    // initialize the public routes where there will be no checking
    this.publicRoutes = {
      '/login': true
    };
    // checks for the local jwt token and redirects to the dashboard if it is valid
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      HttpService.serve('https://' + location.host + '/inventmanapi/me', 'GET', {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }, null)
        .then(response=> {
          if (response.username) {
            // store the username in this Component
            this.username = response.username;
            // redirect to dashboard
            _parentRouter.navigate('/dashboard');
          }
          else {
            // remove the jwt token for security
            localStorage.removeItem('jwt');
          }
        });
    }
  }

  activate(instruction) {
    let url = this._parentRouter.lastNavigationAttempt;
    if (!this.publicRoutes[url] && !localStorage.getItem('jwt')) {
      instruction.component = LoginApp;
    }
    return super.activate(instruction);
  }
}