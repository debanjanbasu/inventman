/// <reference path="../../typings/angular2/angular2.d.ts" />
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
import { Component, View, formDirectives } from 'angular2/angular2';
import { Router } from 'angular2/router';
import { HttpService } from '../../services/httpservice/httpservice';
export let LoginApp = class {
    constructor(router) {
        this.router = router;
    }
    onSubmit() {
        const username = this.username, password = this.password;
        HttpService.serve('https://' + location.host + '/userapi/sessions/create', 'POST', {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, JSON.stringify({ username, password }))
            .then(response => {
            if (!response.id_token) {
                alert(response.message);
                localStorage.removeItem('jwt');
            }
            else {
                localStorage.setItem('jwt', response.id_token);
                this.router.parent.navigate('/dashboard');
            }
        });
    }
};
LoginApp = __decorate([
    Component({
        selector: 'login-app'
    }),
    View({
        templateUrl: './jsts/components/login/login.html',
        directives: [formDirectives],
        styleUrls: ['./jsts/components/login/login.css']
    }), 
    __metadata('design:paramtypes', [Router])
], LoginApp);
//# sourceMappingURL=login.js.map