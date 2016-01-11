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

        $("html").css("background-image", "url('media/img/backgrounds/" + data[index] + "')");
        $scope.last_background = index;
    }

    function generateIndex(data) {
        return Math.floor((Math.random() * data.length));
    }
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

app.filter('customSearch', function () {
    return function (input, search) {
        if (!input) return input;
        if (!search) return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function (value, key) {
            var actual = ('' + value.name).toLowerCase();
            if (actual.indexOf(expected) !== -1) {
                result[key] = value;
            }
        });
        return result;
    }
});
