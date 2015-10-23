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

    var success_class = "success";
    var error_class = "error";

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
                console.log(data);
                functions[data[0].toLowerCase()](data[1]);
            }
            catch (e) {
                print_result(data, success_class);
            }
        }, function (msg) {
            $rootScope.load(false);
            print_result(msg, error_class);
        });
    };

    var functions = []; //listplayers, (settimeofday, broadcast, saveworld, destroywilddinos)?

    functions["listplayers"] = function (data) {
        if(data[0].playername){
            for (var i = 0; i < data.length; i++) {
                print_result(data[i].uid + " - " + data[i].playername + " " + data[i].steamid, success_class);
            }
        }else{
            print_result(data, success_class);
        }

    };

    function print_result(data, type) {
        console.log("print op");
        var d = new Date();
        angular.element("#result-results").append("<div class='result-results "+ type +"'><i>[" + addZero(d.getHours()) + ":"
            + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds()) + "]</i> " + data + "</div>");
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }


    $scope.clear_result = function () {
        angular.element("#result-results").html("");
    }
}]);