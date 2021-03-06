app.factory('ToolsFactory', ['$http', '$q', function ($http, $q) {
    return {
        getBackgrounds: function () {
            var deferred = $q.defer();
            $http.get(server + 'backgrounds/', {cache: true})
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

app.controller('ToolsController', ['$scope', '$rootScope', 'superCache', 'ToolsFactory', function ($scope, $rootScope, superCache, ToolsFactory) {
    var backgrounds_cache = superCache.get('backgrounds_cache');
    $scope.last_background = null;

    $scope.get_backgrounds_ramdom = function () {
        if (backgrounds_cache) {
            setBackground(cache);
        } else {
            ToolsFactory.getBackgrounds().then(function (data) {
                setBackground(data);
                superCache.put('backgrounds_cache', data);
            }, function () {
                console.log("No background from server");
            });
        }
    };

    $scope.get_backgrounds = function () {

    };

    function setBackground(data) {
        var index = generateIndex(data);

        if ($scope.last_background == null) {
            $scope.last_background = index;
        }
        else if ($scope.last_background == index) {
            setBackground(data);
        }

        $("html").css("background-image", "url('media/img/backgrounds/" + data[index] + "')").css("background-repeat", "repeat-y");
        $scope.last_background = index;
    };

    function generateIndex(data) {
        return Math.floor((Math.random() * data.length));
    };
}]);

app.service('SelectedProperties', function () {
    var player_selected = '';
    var item_selected = "";

    return {
        getPlayerSelected: function () {
            return player_selected;
        },
        setPlayerSelected: function (value) {
            player_selected = value;
        },
        getItemSelected: function () {
            return item_selected;
        },
        setItemSelected: function (value) {
            item_selected = value;
        }
    };
});

app.service('CurrentServer', function(){
    var currentServer = {};

    return {
        getCurrentServer: function () {
            return currentServer;
        },
        setCurrentServer: function (value) {
            currentServer = value;
        }
    };
});

app.filter('customSearch', function () {
    return function (input, search) {
        if (!input) return input;
        if (!search) return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function (value, key) {
            if(value.name != null){
                var actual = ('' + value.name).toLowerCase();
            }else{
                var actual = ('' + value.playername).toLowerCase();
            }

            if (actual.indexOf(expected) !== -1) {
                result[key] = value;
            }
        });
        return result;
    }
});

app.filter('toTimer', function () {
    return function (value) {
        var duration = moment().startOf('day').add(value, "s"),
            format = "";

        if(duration.hour() > 0){ format += "HH[h ]"; }

        if(duration.minute() > 0){ format += "mm[m ]"; }

        format += "ss[s]";

        return duration.format(format);
    }
});

app.directive('ngConfirmClick', [
    function () {
        return {
            priority: -1,
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function (e) {
                    var message = attrs.ngConfirmClick;
                    if (message && !confirm(message)) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        }
    }
]);