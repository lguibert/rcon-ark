app.factory('CommandesFactory', ['$http', '$q', function ($http, $q) {
    return {
        sendCommand: function (cmd, attrs) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'command/',
                data: [cmd, attrs],
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

app.controller('CommandesController', ['$scope', '$rootScope', 'superCache', 'CommandesFactory', '$location', function ($scope, $rootScope, superCache, CommandesFactory, $location) {
    $scope.default = [{
        "hour": 7,
        "minute": 30
    }
    ];

    $scope.check_user = function(){
        if(!$scope.currentUser){
            $location.path("/login");
        }
    };


    $scope.send_command = function (cmd, attrs) {
        $rootScope.load(true);
        CommandesFactory.sendCommand(cmd, attrs).then(function (data) {
            angular.element("#result-results").append("<br/>").append(data);
            $rootScope.load(false);
        }, function (msg) {
            $rootScope.load(false);
            displayMessage(msg, "error");
        });
    };

    $scope.clear_result = function(){
        angular.element("#result-results").html("");
    }
}]);