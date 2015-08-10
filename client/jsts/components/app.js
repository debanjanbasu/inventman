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
import { Component, View, bootstrap } from 'angular2/angular2';
import { routerInjectables, RouteConfig } from 'angular2/router';
import { LoginApp } from './login/login';
import { DashboardApp } from './dashboard/dashboard';
import { LoggedInRouterOutlet } from './LoggedInRouterOutlet';
let InventmanApp = class {
    constructor() {
    }
};
InventmanApp = __decorate([
    Component({
        selector: 'inventman-app'
    }),
    View({
        template: `<!-- The router-outlet displays the template for the current component based on the URL -->
    <router-outlet></router-outlet>`,
        directives: [LoggedInRouterOutlet]
    }),
    RouteConfig([
        { path: '/', redirectTo: '/login' },
        { path: '/dashboard', as: 'dashboard', component: DashboardApp },
        { path: '/login', as: 'login', component: LoginApp }
    ]), 
    __metadata('design:paramtypes', [])
], InventmanApp);
bootstrap(InventmanApp, [
    routerInjectables
]);
//# sourceMappingURL=app.js.map