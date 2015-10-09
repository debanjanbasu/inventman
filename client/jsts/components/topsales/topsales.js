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
var topsalespi_1 = require('./topsalespi/topsalespi');
var TopSalesWidget = (function () {
    function TopSalesWidget(router) {
        var _this = this;
        this.router = router;
        console.log('Constructing the initial Top 10 Sales Data...');
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/7', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.json();
            }).then(function (salesdata) {
                _this.graphData = salesdata;
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
    }
    TopSalesWidget.prototype.selectPeriod = function (value) {
        var _this = this;
        console.log('Constructing the ' + value + ' Top 10 Sales Data...');
        var period = -1;
        switch (value) {
            case 'weekly':
                period = 7;
                break;
            case 'monthly':
                period = 30;
                break;
            case 'annually':
                period = 365;
                break;
            case 'max':
                period = -1;
                break;
            default:
                period = -1;
                break;
        }
        ;
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/' + period, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.json();
            }).then(function (salesdata) {
                _this.graphData = salesdata;
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
    TopSalesWidget = __decorate([
        angular2_1.Component({
            selector: 'topsales-widget'
        }),
        angular2_1.View({
            templateUrl: './jsts/components/topsales/topsales.html',
            styleUrls: ['./jsts/components/topsales/topsales.css'],
            directives: [topsalespi_1.TopSalesPi]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], TopSalesWidget);
    return TopSalesWidget;
})();
exports.TopSalesWidget = TopSalesWidget;
//# sourceMappingURL=topsales.js.map