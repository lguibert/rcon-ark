app.factory('ScriptsFactory', ['$http', '$q', function ($http, $q) {
    return {
        sendScript: function (script) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'script/',
                data: script,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }
    };
}]);


app.controller('ScriptsController', ['$scope', '$rootScope', 'superCache', 'ScriptsFactory', '$location', function ($scope, $rootScope, superCache, ScriptsFactory, $location) {
    $scope.send_script = function (script) {
        $rootScope.load(true);
        ScriptsFactory.sendScript(script).then(function (data) {
            angular.element("#result-results").append("<br/>").append(data);
            $rootScope.load(false);
        }, function (msg) {
            $rootScope.load(false);
            displayMessage(msg, "error");
        });
    };
}]);