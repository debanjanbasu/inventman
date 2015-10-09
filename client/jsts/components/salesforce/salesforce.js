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
var salesgraph_1 = require('./salesgraph/salesgraph');
var SalesforceWidget = (function () {
    function SalesforceWidget(router) {
        var _this = this;
        this.router = router;
        var tempData = [];
        console.log('Constructing the initial Cumulative Sales Data...');
        var jwt = localStorage.getItem('jwt');
        if (jwt) {
            window.fetch('https://' + location.host + '/inventmanapi/getsales/all', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(function (response) {
                return response.json();
            }).then(function (fullsalesdata) {
                for (var _i = 0; _i < fullsalesdata.length; _i++) {
                    var data = fullsalesdata[_i];
                    data._id = new Date(Date.parse(data._id));
                }
                fullsalesdata.sort(function (a, b) {
                    var c = new Date(a._id);
                    var d = new Date(b._id);
                    return c - d;
                });
                tempData.push("Cumulative Aggregated Sales");
                tempData.push(fullsalesdata);
                var top10skus = window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/7', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    }
                }).then(function (response) {
                    return response.json();
                }).catch(function (error) {
                    console.log(error.message);
                    localStorage.removeItem('jwt');
                    _this.router.navigateByUrl('/login');
                });
                Promise.resolve(top10skus).then(function (skus) {
                    var justSKUS = [];
                    for (var _i = 0; _i < skus.length; _i++) {
                        var sku = skus[_i];
                        justSKUS.push(sku._id.sku);
                    }
                    return justSKUS;
                }).then(function (skus) {
                    var promisegenArray = [];
                    for (var _i = 0; _i < skus.length; _i++) {
                        var sku = skus[_i];
                        promisegenArray.push(_this.promiseGenforSKUSales(sku));
                    }
                    Promise.all(promisegenArray).then(function (result2) {
                        for (var i = 0; i < skus.length; i++) {
                            tempData.push(skus[i]);
                            tempData.push(result2[i]);
                        }
                        console.log('All sales data pulled...');
                        _this.graphData = tempData;
                    }).catch(function (error) {
                        throw error;
                    });
                }).catch(function (error) {
                    throw error;
                });
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
    SalesforceWidget.prototype.promiseGenforSKUSales = function (sku) {
        var jwt = localStorage.getItem('jwt');
        return window.fetch('https://' + location.host + '/inventmanapi/getsales/' + sku, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }
        }).then(function (response) {
            return response.json();
        }).then(function (skusalesdata) {
            for (var _i = 0; _i < skusalesdata.length; _i++) {
                var data = skusalesdata[_i];
                data._id = new Date(Date.parse(data._id));
            }
            skusalesdata.sort(function (a, b) {
                var c = new Date(a._id);
                var d = new Date(b._id);
                return c - d;
            });
            return skusalesdata;
        }).catch(function (error) {
            throw error;
        });
    };
    SalesforceWidget = __decorate([
        angular2_1.Component({
            selector: 'salesforce-widget'
        }),
        angular2_1.View({
            templateUrl: './jsts/components/salesforce/salesforce.html',
            styleUrls: ['./jsts/components/salesforce/salesforce.css'],
            directives: [salesgraph_1.SalesGraph]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], SalesforceWidget);
    return SalesforceWidget;
})();
exports.SalesforceWidget = SalesforceWidget;
//# sourceMappingURL=salesforce.js.map