app.factory('ServersFactory', ['$http', '$q', function ($http, $q) {
    return {
        getMyservers: function (username) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/',
                data: username,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        postServer: function (newserver, username) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/change/',
                data: [newserver, username],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        connectToServer: function (goserver, username) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/connect/',
                data: [goserver, username],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        deleteServer: function (goserver, username) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/delete/',
                data: [goserver, username],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

    };
}]);

app.controller('ServersController', ['$scope', '$rootScope', 'superCache', 'ServersFactory', '$location', '$filter',
    function ($scope, $rootScope, superCache, ServersFactory, $location, $filter) {
        //var servers_cache = superCache.get('servers_cache');
        $scope.loading = true;
        getMyServers();

        function getMyServers(){
            ServersFactory.getMyservers().then(function (data) {
                //superCache.put('servers_cache', data);
                $scope.loading = false;
                $scope.loading_update = false;
                $scope.servers = data;
                $("#main_myservers").removeClass("animated");
            }, function (msg) {
                $scope.loading = false;
                $scope.loading_update = false;
                console.log("<==== Error ====>");
            });
        };

        $scope.connectToServer = function (server){
            $scope.loading_update = true;
            ServersFactory.connectToServer(server, $rootScope.globals.currentUser.username).then(function () {
                $rootScope.server = server;
                $scope.loading_update = false;
                $location.path('/commands');
            }, function (msg) {
                $scope.loading_update = false;
                MessageHandler.displayMessage({msg: $filter('translate')('ERROR_CONNECTION_SERVER')});
                //$('#message').html("<div class='error'>"+$filter('translate')('ERROR_CONNECTION_SERVER')+"</div>").addClass("shake2");
            });
        };

        $scope.showChangeServer = function(server){
            if(server){
                $scope.server = server;
            }
            var div = $("#changeServer");
            if(div.is(":visible")){
                div.removeClass("slideInDown").addClass("slideOutUp").delay(700).hide(0);
            }else{
                div.removeClass("slideOutUp").addClass("slideInDown").show();
            }
        };

        $scope.changeServer = function(server){
            $scope.loading_update = true;
            ServersFactory.postServer(server, $rootScope.globals.currentUser.username).then(function (data) {
                getMyServers();
            }, function (msg) {
                $scope.loading = false;
                console.log(msg);
            });
        };

        $scope.deleteServer = function(server){
            $scope.loading_update = true;
            ServersFactory.deleteServer(server, $rootScope.globals.currentUser.username).then(function (data) {
                getMyServers();
            }, function (msg) {
                $scope.loading = false;
                console.log(msg);
            });
        }


    }]);