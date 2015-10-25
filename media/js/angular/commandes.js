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
                .error(function (msg) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        }
    };
}]);

app.controller('CommandesController', ['$scope', '$rootScope', 'superCache', 'CommandesFactory', '$location', function ($scope, $rootScope, superCache, CommandesFactory, $location) {
    var success_class = "success";
    var error_class = "error";

    $scope.default = [{
        "hour": 7,
        "minute": 30
    }
    ];

    $scope.set_selected = function (player){
        $scope.player_selected = player;
    };

    $scope.is_selected = function(player){
        return $scope.player_selected === player;
    };

    $scope.check_user = function () {
        if (!$scope.currentUser) {
            $location.path("/login");
        }
    };

    $scope.get_online_players = function(){
       $scope.send_command("ListPlayers", "");
    };

    $scope.send_command = function (cmd, attrs) {
        $rootScope.load(true);
        CommandesFactory.sendCommand(cmd, attrs).then(function (data) {
            $rootScope.load(false);
            $scope.online_players = data[1];
            try {
                functions[data[0].toLowerCase()](data[1]);
            }
            catch (e) {
                $rootScope.print_result(data, success_class);
            }
        }, function (msg) {
            $rootScope.load(false);
            $rootScope. print_result(msg, error_class);
        });
    };

    var functions = []; //listplayers, (settimeofday, broadcast, saveworld, destroywilddinos)?

    functions["listplayers"] = function (data) {
        if(data[0].playername){
            $rootScope.print_result("La liste des joueurs à été mise à jour. ("+data.length+" joueur(s) en ligne)", success_class);

        }else{
            $rootScope.print_result(data, success_class);
        }
    };


    $scope.clear_result = function () {
        angular.element("#result-results").html("");
    }
}]);