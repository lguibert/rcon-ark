/*app.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService, Session, $location, $translate) {
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
});*/

app.controller('LoginController', function ($scope, $rootScope, AuthenticationService, $location) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $rootScope.logged = false;

    $scope.login = function (credentials) {
        credentials.password = String(CryptoJS.SHA256(credentials.password));
        AuthenticationService.Login(credentials, function(response){
            if(response.success){
                $("#login").addClass('fadeOut');
                AuthenticationService.SetCredentials(response.data[0], response.data[1], response.data[2]);
                $rootScope.logged = true;
                $rootScope.role = response.data[2];
                $location.path('/myservers');
            }else{
                $scope.messageLogin = true;
                $("#messageLogin").html("<div class='error'>Problème lors de la connexion. Vérifier vos paramètres.</div>").addClass("shake2");
            }
        });
    };

    $scope.logout = function (){
        AuthenticationService.ClearCredentials();
        $rootScope.logged = false;
        $location.path("/login");
    }
});