app.factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http({
            method: 'POST',
            url: server + 'login/',
            data: credentials,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (res) {
            Session.create(res[0], res[1], res[2]);
            return res;
        });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
});

app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, Session, $location, $translate) {
    $scope.settings = {
        server: null,
        password: null,
        port: 32332
    };

    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            delete $scope.messageLogin;
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user.data);
            $location.path("/myservers");
        }, function (msg) {
            console.log(msg);
            $scope.messageLogin = true;
            $("#messageLogin").html("<div class='error'>Problème lors de la connexion. Vérifier vos paramètres.</div>");
            //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    $scope.logout = function (){
        Session.destroy();
        $scope.deleteCurrentUser();
        $location.path("/home");
    }
});


app.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
});