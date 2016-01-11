var app = angular.module('rcon-ark', ['ngAnimate', 'ui.router', 'pascalprecht.translate']);
//var server = "http://tools.nexusrcon.net/ark-api/";
//var server = "http://dev.lucasguibert.com:8003/";
var server = "http://localhost:8003/";

app.service('LoadingState', ['$rootScope', function ($rootScope) {
    return {
        getLoadingState: function () {
            return this.loading;
        },
        setLoadingState: function (state) {
            this.loading = state;
            $rootScope.$emit("ChangedState");
        }
    }
}]);

app.controller('MainController', ['$scope', '$rootScope', 'LoadingState', 'AuthService', 'USER_ROLES',
    function ($scope, $rootScope, LoadingState, AuthService, USER_ROLES) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;

        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.deleteCurrentUser = function () {
            delete $scope.currentUser;
        };


        $rootScope.$on('ChangedState', function () {
            $scope.loading = LoadingState.getLoadingState();
        });

        $rootScope.load = function (bool) {
            if (bool) {
                angular.element('#loading').addClass("disabled");
            } else {
                angular.element('#loading').removeClass("disabled");
            }

            LoadingState.setLoadingState(bool);
            $scope.loading = LoadingState.getLoadingState();
        };

        $rootScope.print_result = function (data, type) {
            var d = new Date();
            angular.element("#result-results").append("<div class='result-results " + type + "'><i>[" + addZero(d.getHours()) + ":"
                + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds()) + "]</i> " + data + "</div>");
        };

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }]);

app.factory('superCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory('myData');
}]);

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    guest: 'guest'
});

app.directive('ngConfirmClick', [
    function () {
        return {
            priority: 1,
            terminal: true,
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Etes-vous sûr de vouloir faire cette action?";
                var clickAction = attr.ngClick;
                element.bind('click', function () {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);
