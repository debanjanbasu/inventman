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
var SalesGraph = (function () {
    function SalesGraph() {
        this.myDataSets = [];
    }
    SalesGraph.prototype.addData = function (sku) {
    };
    SalesGraph.prototype.removeData = function (sku) {
    };
    SalesGraph.prototype.onChanges = function () {
        if (this.data && this.data[1] && !this.chart) {
            var colorsArray = ["#551A8B"];
            for (var i = 0; i < this.data.length; i += 2) {
                var newSet = {
                    title: this.data[i],
                    fieldMappings: [{
                            fromField: "totalvalue",
                            toField: "value"
                        }, {
                            fromField: "qtysales",
                            toField: "volume"
                        }],
                    dataProvider: this.data[i + 1],
                    categoryField: "_id",
                    color: colorsArray[i]
                };
                this.myDataSets.push(newSet);
            }
            AmCharts.themes.none = {};
            var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
            categoryAxesSettings.maxSeries = 0;
            this.chart = AmCharts.makeChart("chartdiv", {
                type: "stock",
                "theme": "none",
                dataSets: this.myDataSets,
                panels: [{
                        showCategoryAxis: false,
                        title: "Value",
                        percentHeight: 70,
                        stockGraphs: [{
                                id: "g1",
                                valueField: "value",
                                comparable: true,
                                compareField: "value",
                                balloonText: "[[title]]:<b>[[value]]</b>",
                                compareGraphBalloonText: "[[title]]:<b>[[value]]</b>"
                            }],
                        stockLegend: {
                            periodValueTextComparing: "[[percents.value.close]]%",
                            periodValueTextRegular: "[[value.close]]"
                        }
                    },
                    {
                        title: "Volume",
                        percentHeight: 30,
                        stockGraphs: [{
                                valueField: "volume",
                                type: "column",
                                showBalloon: false,
                                fillAlphas: 1
                            }],
                        stockLegend: {
                            periodValueTextRegular: "[[value.close]]"
                        }
                    }
                ],
                chartScrollbarSettings: {
                    graph: "g1"
                },
                chartCursorSettings: {
                    valueBalloonsEnabled: true,
                    fullWidth: true,
                    cursorAlpha: 0.1,
                    valueLineBalloonEnabled: true,
                    valueLineEnabled: true,
                    valueLineAlpha: 0.5
                },
                periodSelector: {
                    position: "left",
                    periods: [{
                            period: "MM",
                            count: 1,
                            label: "1 month"
                        }, {
                            period: "YYYY",
                            count: 1,
                            label: "1 year"
                        }, {
                            period: "YTD",
                            label: "YTD"
                        }, {
                            period: "MAX",
                            selected: true,
                            label: "MAX"
                        }]
                },
                dataSetSelector: {
                    position: "left"
                },
                "export": {
                    "enabled": true
                },
                categoryAxesSettings: categoryAxesSettings
            });
        }
    };
    SalesGraph = __decorate([
        angular2_1.Component({
            selector: 'sales-graph',
            inputs: ['data']
        }),
        angular2_1.View({
            template: "<div id=\"chartdiv\"></div>",
            styleUrls: ['./jsts/components/salesforce/salesgraph/salesgraph.css']
        }), 
        __metadata('design:paramtypes', [])
    ], SalesGraph);
    return SalesGraph;
})();
exports.SalesGraph = SalesGraph;
//# sourceMappingURL=salesgraph.js.map