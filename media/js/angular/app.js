var app = angular.module('rcon-ark', ['ngRoute', 'ngAnimate']);
var server = "http://dev.lucasguibert.com:8003/";


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

app.controller('MainController', ['$scope', '$rootScope', 'LoadingState', function ($scope, $rootScope, LoadingState) {
    $rootScope.$on('ChangedState', function () {
        $scope.loading = LoadingState.getLoadingState();
    });
}]);

app.factory('superCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory('myData');
}]);