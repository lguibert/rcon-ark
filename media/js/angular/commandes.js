app.factory('CommandesFactory', ['$http', '$q', function ($http, $q) {
    var factory = {
        sendCommand: function (cmd, attrs) {
            var deferred = $q.defer();
            $http.get(server + 'command/' + cmd + (attrs ? '/' + attrs : ''), {cache: false})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(null);
                });
            return deferred.promise;
        },
    }
    return factory;
}]);

app.controller('CommandesController', ['$scope', '$rootScope', 'superCache', 'CommandesFactory', 'LoadingState', '$location', function ($scope, $rootScope, superCache, CommandesFactory, LoadingState, $location) {
    $scope.default = [{
        "hour": 7,
        "minute": 30
    }
    ];

    $scope.send_command = function (cmd, attrs) {
        loading(true);
        CommandesFactory.sendCommand(cmd, attrs).then(function (data) {
            angular.element("#result").html(data);
            loading(false);
        }, function (msg) {
            loading(false);
            displayMessage(msg, "error");
        });

    };

    function loading(bool) {
        if (bool) {
            angular.element('#result').addClass("disabled");
        } else {
            angular.element('#result').removeClass("disabled");
        }

        LoadingState.setLoadingState(bool);
        $scope.loading = LoadingState.getLoadingState();
    };
}]);