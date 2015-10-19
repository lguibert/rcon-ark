app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
        }).state('commands', {
            url: '/commands',
            templateUrl: 'templates/commands.html',
            data: {
                authorizedRoles: USER_ROLES.admin
            }
        });
}]);

/*
 angular.module('myapp', ['ngCookies']).
 config([
 '$httpProvider',
 '$interpolateProvider',
 function ($httpProvider, $interpolateProvider) {
 $interpolateProvider.startSymbol('{$');
 $interpolateProvider.endSymbol('$}');
 $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
 }])
 */