app.factory('CommandesFactory', ['$http', '$q', function ($http, $q) {
    return {
        sendCommand: function (cmd, attrs, currentServer) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'command/',
                data: [cmd, attrs, currentServer],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (msg) {
                    deferred.reject(msg);
                });
            return deferred.promise;
        },
        getInfoSupPlayers: function () {
            /* $.ajax("http://api.tpdo.fr/ark-server/api/list_players").done(function (infos) {
             return infos;
             }).fail(function (msg) {
             return("Erreur");
             });*/
            var deferred = $q.defer();
            $.getJSON("http://api.tpdo.fr/ark-server/api/list_players", function (data) {
                deferred.resolve(data);
            }).fail(function () {
                deferred.reject(data);
            });
            /*$http({
             method: 'JSONP',
             url: "http://api.tpdo.fr/ark-server/api/list_players",
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .success(function (data) {
             deferred.resolve(data);
             })
             .error(function (data) {
             deferred.reject(data);
             });*/
            return deferred.promise;
        }
    };
}]);

app.controller('CommandesController', ['$scope', '$rootScope', 'superCache', 'CommandesFactory', '$location', 'SelectedProperties', '$window', '$interval',
    function ($scope, $rootScope, superCache, CommandesFactory, $location, SelectedProperties, $window, $interval) {
        var success_class = "success";
        var error_class = "error";

        $scope.default = [{
            "hour": 7,
            "minute": 30
        }
        ];

        $interval(function () {
            CommandesFactory.getInfoSupPlayers().then(function (infos) {
                $scope.online_players_info = infos
            });
            //$("#result").scrollTop($("#result")[0].scrollHeight); //PERMET LE SCROLL DOWN AUTO
        }, 5000);

        $scope.set_selected = function (player) {
            SelectedProperties.setPlayerSelected(player);
            $scope.player_selected = player;
        };

        $scope.is_selected = function (player) {
            return $scope.player_selected === player;
        };

        $scope.get_online_players = function (log) {
            if (log != false) {
                log = true;
            }
            $scope.send_command("ListPlayers", "", "player", log);
        };

        $scope.send_command = function (cmd, attrs, type_loading, log) {
            //$rootScope.load(true);
            if (type_loading) {
                if (type_loading == "player") {
                    $scope.loading_player = true;
                }
            }
            if (log != false) {
                log = true;
            }
            $scope.loading_command = true;
            try {
                functions[cmd.toLowerCase()]();
            }
            catch (e) {
            }
            CommandesFactory.sendCommand(cmd, attrs, $window.sessionStorage.currentServer).then(function (data) {
                //$rootScope.load(false);
                $scope.loading_command = false;
                $scope.loading_player = false;
                $scope.auto_reload = false;
                try {
                    if (data[1][0].playername) {
                        CommandesFactory.getInfoSupPlayers().then(function (infos) {
                            $scope.online_players_info = infos;
                            $scope.online_players = data[1];
                        }, function () {
                            $scope.online_players = data[1];
                        });
                    }
                    if (log) {
                        functions[data[0].toLowerCase()](data[1]);
                    }
                }
                catch (e) {
                    $rootScope.print_result(data, success_class);
                }
            }, function (msg) {
                //$rootScope.load(false);
                $scope.loading_command = false;
                $scope.loading_player = false;
                $rootScope.print_result("Erreur inconnue", error_class);
            });
        };

        var functions = []; //listplayers, (settimeofday, broadcast, saveworld, destroywilddinos)?

        functions["listplayers"] = function (data) {
            if (data[0].playername) {
                $rootScope.print_result("La liste des joueurs à été mise à jour. (" + data.length + " joueur(s) en ligne)", success_class);

            } else {
                $rootScope.print_result(data, success_class);
            }
        };

        functions["giveitemnumtoplayer"] = function () {
            console.log(SelectedProperties.getItemSelected());
            console.log(SelectedProperties.getPlayerSelected());
        };

        functions['getgamelog'] = function(data){
            $rootScope.print_result("<div class='log'>" + data + "</div>", "log");
        };

        $scope.get_attrs_giveitem = function () {
            var string = "786879923" + SelectedProperties.getItemSelected().id + " " + "1" + " " + "1" + " " + "false";
            return string;
        };

        $scope.clear_result = function () {
            angular.element("#result-results").html("");
        }
    }
])
;