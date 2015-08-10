/// <reference path="../typings/angular2/angular2.d.ts" />
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, Attribute, ElementRef, DynamicComponentLoader } from 'angular2/angular2';
import { Router, RouterOutlet } from 'angular2/router';
import { LoginApp } from './login/login';
import { HttpService } from '../services/httpservice/httpservice';
export let LoggedInRouterOutlet = class extends RouterOutlet {
    constructor(_elementRef, _loader, _parentRouter, nameAttr) {
        super(_elementRef, _loader, _parentRouter, nameAttr);
        this._elementRef = _elementRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this.publicRoutes = {
            '/login': true
        };
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            HttpService.serve('https://' + location.host + '/inventmanapi/me', 'GET', {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }, null)
                .then(response => {
                if (response.username) {
                    this.username = response.username;
                    _parentRouter.navigate('/dashboard');
                }
                else {
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
};
LoggedInRouterOutlet = __decorate([
    Directive({
        selector: 'router-outlet'
    }),
    __param(3, Attribute('name')), 
    __metadata('design:paramtypes', [ElementRef, DynamicComponentLoader, Router, String])
], LoggedInRouterOutlet);
//# sourceMappingURL=LoggedInRouterOutlet.js.map