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
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var DashboardApp = (function () {
    function DashboardApp(router) {
        this.router = router;
        Waves.attach('.button', ['waves-button']);
        Waves.init();
    }
    DashboardApp.prototype.logOut = function () {
        localStorage.removeItem('jwt');
        this.router.navigate('/login');
    };
    DashboardApp.prototype.forceSyncDB = function () {
        var _this = this;
        console.log('syncing the database...');
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            window.fetch('https://' + location.host + '/inventmanapi/syncdb', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                if (json.status == 'success') {
                    console.log('success');
                }
                else if (json.status == 'failure') {
                    console.log('failure');
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
    };
    DashboardApp = __decorate([
        angular2_1.Component({
            selector: 'dashboard-app'
        }),
        angular2_1.View({
            templateUrl: './jsts/components/dashboard/dashboard.html',
            styleUrls: ['./jsts/components/dashboard/dashboard.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], DashboardApp);
    return DashboardApp;
})();
exports.DashboardApp = DashboardApp;
//# sourceMappingURL=dashboard.js.map