var app = angular.module('rcon-ark', ['ngRoute', 'pascalprecht.translate', 'ngCookies', 'ngAnimate', 'angular-clipboard']);
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

app.controller('MainController', ['$scope', '$rootScope', 'LoadingState',
    function ($scope, $rootScope, LoadingState) {

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
            if(type == "log"){
                if(data.length == 32){
                    return; // regle le probleme du undefiend de derriere les fagots
                }
                type = "normal";
                var selector = "#result-log"
            }else{
                var selector = "#result-results";
            }

            var toDisplay = "";
            if(data instanceof Array){
                toDisplay = data[1]
            }else{
                toDisplay = data;
            }
            angular.element(selector).append("<div class='result-results " + type + "'>" + toDisplay + "</div>");
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