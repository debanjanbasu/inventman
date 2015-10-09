/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
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
var salesforce_1 = require('../salesforce/salesforce');
var topsales_1 = require('../topsales/topsales');
var DashboardApp = (function () {
    function DashboardApp(router) {
        this.router = router;
        this.classMap1 = { 'fa-database': true };
        this.classMap2 = { 'fa-google': true };
        $(".gridster > ul").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [100, 100],
            resize: {
                enabled: true
            },
            helper: 'clone',
            autogrow_cols: true,
            min_cols: 12
        });
    }
    DashboardApp.prototype.logOut = function () {
        localStorage.removeItem('jwt');
        this.router.navigateByUrl('/login');
    };
    DashboardApp.prototype.forceSyncDB = function () {
        var _this = this;
        console.log('syncing the database...');
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            this.classMap1 = { 'fa-spinner': true, 'fa-pulse': true };
            window.fetch('https://' + location.host + '/inventmanapi/syncdb', {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.text();
            }).then(function (message) {
                console.log(message);
                if (message == "success") {
                    alert('Successfully Synced the DB');
                    _this.classMap1 = { 'fa-database': true };
                }
            }).catch(function (error) {
                console.log(error.message);
                localStorage.removeItem('jwt');
                _this.router.navigateByUrl('/login');
            });
        }
        else {
            localStorage.removeItem('jwt');
            this.router.navigateByUrl('/login');
        }
    };
    DashboardApp.prototype.forceSyncGSheet = function () {
        var _this = this;
        console.log('syncing the Google Spreadsheet...');
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            this.classMap2 = { 'fa-spinner': true, 'fa-pulse': true };
            window.fetch('https://' + location.host + '/inventmanapi/syncgsheet', {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.text();
            }).then(function (message) {
                console.log(message);
                if (message == "success") {
                    alert('Successfully Synced the Google Sheets but the procees may be still going in the background as Google API takes long to sync');
                    _this.classMap2 = { 'fa-google': true };
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
    };
    DashboardApp = __decorate([
        angular2_1.Component({
            selector: 'dashboard-app'
        }),
        angular2_1.View({
            templateUrl: './jsts/components/dashboard/dashboard.html',
            styleUrls: ['./jsts/components/dashboard/nav.css', './jsts/components/dashboard/grid.css'],
            directives: [angular2_1.NgClass, salesforce_1.SalesforceWidget, topsales_1.TopSalesWidget]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], DashboardApp);
    return DashboardApp;
})();
exports.DashboardApp = DashboardApp;
//# sourceMappingURL=dashboard.js.map