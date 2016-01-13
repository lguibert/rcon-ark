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
        }

    }]);