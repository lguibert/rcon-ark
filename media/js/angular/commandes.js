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

    $scope.check_user = function () {
        if (!$scope.currentUser) {
            $location.path("/login");
        }
    };


    $scope.send_command = function (cmd, attrs) {
        $rootScope.load(true);
        CommandesFactory.sendCommand(cmd, attrs).then(function (data) {
            $rootScope.load(false);
            try {
                functions[data[0].toLowerCase()](data[1]);
            }
            catch (e) {
                print_result(data);
            }
        }, function (msg) {
            $rootScope.load(false);
            displayMessage(msg, "error");
        });
    };

    var functions = []; //listplayers, (settimeofday, broadcast, saveworld, destroywilddinos)?

    functions["listplayers"] = function (data) {
        for (var i = 0; i < data.length; i++) {
            print_result(data[i].uid + " - " + data[i].playername + " " + data[i].steamid)
        }
    };

    function print_result(data) {
        var d = new Date();
        angular.element("#result-results").append("<div class='result-results'><i>[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]</i> " + data + "</div>");
    };


    $scope.clear_result = function () {
        angular.element("#result-results").html("");
    }
}]);