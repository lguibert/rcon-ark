app.factory('ServersFactory', ['$http', '$q', function ($http, $q) {
    return {
        getMyservers: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/',
                data: id,
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
        postServer: function (newserver, id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/change/',
                data: [newserver, id],
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
        connectToServer: function (goserver, id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/connect/',
                data: [goserver, id],
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
        deleteServer: function (goserver, id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'myservers/delete/',
                data: [goserver, id],
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

app.controller('ServersController', ['$scope', '$rootScope', 'superCache', 'ServersFactory', '$location', '$filter', '$window',
    function ($scope, $rootScope, superCache, ServersFactory, $location, $filter, $window) {
        //var servers_cache = superCache.get('servers_cache');
        $scope.loading = true;
        getMyServers();

        function getMyServers() {
            ServersFactory.getMyservers($rootScope.globals.currentUser.id).then(function (data) {
                //superCache.put('servers_cache', data);
                $scope.loading = false;
                $scope.loading_update = false;
                $scope.servers = data;
                console.log(data);
                $("#main_myservers").removeClass("animated");
            }, function (msg) {
                $scope.loading = false;
                $scope.loading_update = false;
                console.log("<==== Error ====>");
            });
        };

        $scope.connectToServer = function (server) {
            $scope.loading_update = true;
            ServersFactory.connectToServer(server, $rootScope.globals.currentUser.id).then(function (uuid) {
                //CurrentServer.setCurrentServer(uuid);
                console.log(uuid);
                $scope.loading_update = false;
                $window.sessionStorage.currentServer = uuid;
                $location.path('/commands');
            }, function (msg) {
                $scope.loading_update = false;
                MessageHandler.displayMessage({msg: $filter('translate')('ERROR_CONNECTION_SERVER')});
                //$('#message').html("<div class='error'>"+$filter('translate')('ERROR_CONNECTION_SERVER')+"</div>").addClass("shake2");
            });
        };

        $scope.showChangeServer = function (server) {
            if (server) {
                $scope.server = server;
            }
            var div = $("#changeServer");
            if (div.is(":visible")) {
                resetFormChangeServer();
                div.removeClass("slideInDown").addClass("slideOutUp").delay(700).hide(0);
            } else {
                div.removeClass("slideOutUp").addClass("slideInDown").show();
            }
        };

        function resetFormChangeServer() {
            $scope.server = null;
            $scope.formServer.$setUntouched();
            $scope.formServer.$setPristine();
        }

        $scope.changeServer = function (server) {
            $scope.loading_update = true;
            ServersFactory.postServer(server, $rootScope.globals.currentUser.id).then(function (data) {
                $scope.showChangeServer();
                resetFormChangeServer();
                getMyServers();
            }, function (msg) {
                $scope.loading = false;
                console.log(msg);
            });
        };

        $scope.deleteServer = function (server) {
            $scope.loading_update = true;
            ServersFactory.deleteServer(server, $rootScope.globals.currentUser.id).then(function (data) {
                getMyServers();
            }, function (msg) {
                $scope.loading = false;
                console.log(msg);
            });
        }
    }]);