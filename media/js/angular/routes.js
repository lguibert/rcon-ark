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

app.run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('stateChangeStart ', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
});