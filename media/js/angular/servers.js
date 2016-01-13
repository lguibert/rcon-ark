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
        }

    };
}]);

app.controller('ServersController', ['$scope', '$rootScope', 'superCache', 'ServersFactory',
    function ($scope, $rootScope, superCache, ServersFactory) {
        //var servers_cache = superCache.get('servers_cache');

        ServersFactory.getMyservers().then(function (data) {
            //superCache.put('servers_cache', data);
            $scope.servers = data;
        }, function (msg) {
            console.log("<==== Error ====>");
        });

        $scope.show_text = function(text){
            alert(text);
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
            ServersFactory.postServer(server, $rootScope.globals.currentUser.username).then(function (data) {
                console.log("Before : ");
                console.log(data);
                console.log(" : After.");
            }, function (msg) {
                console.log(msg);
            });
        };


    }]);