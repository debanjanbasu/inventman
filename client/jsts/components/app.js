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
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var login_1 = require('./login/login');
var dashboard_1 = require('./dashboard/dashboard');
var InventmanApp = (function () {
    function InventmanApp(router) {
        var _this = this;
        this.router = router;
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            window.fetch('https://' + location.host + '/inventmanapi/me', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (json.username) {
                    _this.router.navigate('/dashboard');
                }
            }).catch(function (error) {
                console.log(error.message);
                localStorage.removeItem('jwt');
                _this.router.navigate('/login');
            });
        }
        else {
            this.router.navigate('/login');
            localStorage.removeItem('jwt');
        }
    }
    InventmanApp = __decorate([
        angular2_1.Component({
            selector: 'inventman-app'
        }),
        angular2_1.View({
            template: "<!-- The router-outlet displays the template for the current component based on the URL -->\n    <router-outlet></router-outlet>",
            directives: [router_1.RouterOutlet]
        }),
        router_1.RouteConfig([
            { path: '/dashboard', as: 'dashboard-app', component: dashboard_1.DashboardApp },
            { path: '/login', as: 'login-app', component: login_1.LoginApp }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], InventmanApp);
    return InventmanApp;
})();
angular2_1.bootstrap(InventmanApp, [
    router_1.ROUTER_BINDINGS]);
//# sourceMappingURL=app.js.map