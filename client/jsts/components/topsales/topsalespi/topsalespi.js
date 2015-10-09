/// <reference path="../../../typings/angular2/angular2.d.ts" />
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
var TopSalesPi = (function () {
    function TopSalesPi(router) {
        this.router = router;
    }
    TopSalesPi.prototype.addData = function (sku) {
    };
    TopSalesPi.prototype.removeData = function (sku) {
    };
    TopSalesPi.prototype.onChanges = function () {
        var _this = this;
        if (this.data && !this.chart) {
            var dataProvider = [];
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var sku = _a[_i];
                dataProvider.push({
                    "sku": sku._id.sku,
                    "quantity": sku.qtysales,
                    "description": '(' + sku._id.name + ') $' + sku.totalvalue
                });
            }
            AmCharts.themes.none = {};
            this.chart = AmCharts.makeChart("chartdiv2", {
                "type": "pie",
                "theme": "none",
                "titles": [{
                        "text": "Top 10 Master SKUs",
                        "size": 16
                    }],
                "dataProvider": dataProvider,
                "valueField": "quantity",
                "titleField": "sku",
                "descriptionField": "description",
                "startEffect": "elastic",
                "startDuration": 2,
                "labelRadius": 15,
                "innerRadius": "50%",
                "depth3D": 10,
                "balloonText": "[[description]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
                "angle": 15,
                "export": {
                    "enabled": true
                },
                "colors": ["#551A8B", "#800080", "#8B008B", "#9932CC", "#9400D3", "#8A2BE2", "#9370DB", "#BA55D3", "#FF00FF", "#DA70D6", "#EE82EE", "#DDA0DD", "#D8BFD8", "#E6E6FA"]
            });
            this.chart.addListener('pullOutSlice', function (slice) {
                _this.addData(slice.dataItem.title);
            });
            this.chart.addListener('pullInSlice', function (slice) {
                _this.removeData(slice.dataItem.title);
            });
        }
        else if (this.data && this.chart) {
            var dataProvider = [];
            for (var _b = 0, _c = this.data; _b < _c.length; _b++) {
                var sku = _c[_b];
                dataProvider.push({
                    "sku": sku._id.sku,
                    "quantity": sku.qtysales,
                    "description": '(' + sku._id.name + ') $' + sku.totalvalue
                });
            }
            this.chart.dataProvider = dataProvider;
            this.chart.validateData();
            this.chart.animateAgain();
        }
    };
    TopSalesPi = __decorate([
        angular2_1.Component({
            selector: 'topsales-pi',
            inputs: ['data']
        }),
        angular2_1.View({
            template: "<div id=\"chartdiv2\"></div>",
            styleUrls: ['./jsts/components/topsales/topsalespi/topsalespi.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], TopSalesPi);
    return TopSalesPi;
})();
exports.TopSalesPi = TopSalesPi;
//# sourceMappingURL=topsalespi.js.map