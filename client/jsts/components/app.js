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
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.text();
            }).then(function (message) {
                if (message == "success") {
                    _this.router.navigateByUrl('/dashboard');
                }
                else {
                    console.log(message);
                    localStorage.removeItem('jwt');
                    _this.router.navigateByUrl('/login');
                }
            }).catch(function (error) {
                console.log(error.message);
                localStorage.removeItem('jwt');
                _this.router.navigateByUrl('/login');
            });
        }
        else {
            this.router.navigateByUrl('/login');
            localStorage.removeItem('jwt');
        }
    }
    InventmanApp = __decorate([
        angular2_1.Component({
            selector: 'inventman-app'
        }),
        angular2_1.View({
            template: '<router-outlet></router-outlet>',
            directives: [router_1.ROUTER_DIRECTIVES]
        }),
        router_1.RouteConfig([
            { path: '/dashboard', as: 'DashboardCmp', component: dashboard_1.DashboardApp },
            { path: '/login', as: 'LoginCmp', component: login_1.LoginApp }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], InventmanApp);
    return InventmanApp;
})();
angular2_1.bootstrap(InventmanApp, [
    router_1.routerBindings(InventmanApp),
    angular2_1.bind(router_1.LocationStrategy).toClass(router_1.PathLocationStrategy),
    angular2_1.bind(router_1.APP_BASE_HREF).toValue('/')]);
//# sourceMappingURL=app.js.map