app.factory('ScriptsFactory', ['$http', '$q', function ($http, $q) {
    return {
        sendScript: function (script, attrs) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'script/',
                data: [script, attrs],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (msg) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }
    };
}]);


app.controller('ScriptsController', ['$scope', '$rootScope', 'superCache', 'ScriptsFactory', function ($scope, $rootScope, superCache, ScriptsFactory) {
    $scope.send_script = function (script, attrs) {
        $rootScope.load(true);
        ScriptsFactory.sendScript(script, attrs).then(function (data) {
            $rootScope.print_result(data, "success");
            $rootScope.load(false);
        }, function (msg) {
            $rootScope.load(false);
            $rootScope.print_result(msg, "error");
        });
    };
}]);