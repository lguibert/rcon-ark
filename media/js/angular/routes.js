app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/commandes', {templateUrl: 'templates/commandes.html'})
        .otherwise({redirectTo: '/commandes'});
}]);