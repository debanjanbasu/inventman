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
var LoginApp = (function () {
    function LoginApp(router) {
        this.router = router;
    }
    LoginApp.prototype.onSubmit = function () {
        var _this = this;
        window.fetch('https://' + location.host + '/userapi/sessions/create', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: this.username, password: this.password })
        }).then(function (response) {
            return response.text();
        }).then(function (message) {
            if (message == 'fail') {
                alert('Something serious went wrong');
                localStorage.removeItem('jwt');
            }
            else if (message == "Wrong password provided" || message == "No such user exists") {
                alert(message);
                localStorage.removeItem('jwt');
            }
            else {
                localStorage.setItem('jwt', message);
                _this.router.navigateByUrl('/dashboard');
            }
        }).catch(function (error) {
            localStorage.removeItem('jwt');
            console.log(error.message);
        });
    };
    LoginApp = __decorate([
        angular2_1.Component({
            selector: 'login-app'
        }),
        angular2_1.View({
            templateUrl: './jsts/components/login/login.html',
            directives: [angular2_1.FORM_DIRECTIVES],
            styleUrls: ['./jsts/components/login/login.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], LoginApp);
    return LoginApp;
})();
exports.LoginApp = LoginApp;
//# sourceMappingURL=login.js.map