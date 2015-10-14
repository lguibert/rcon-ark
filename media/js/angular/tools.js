app.factory('ToolsFactory', ['$http', '$q', function ($http, $q) {
    return {
        getBackgrounds: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: server + 'backgrounds/',
                cache: true
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

app.controller('ToolsController', ['$scope', '$rootScope', 'superCache', 'ToolsFactory', function ($scope, $rootScope, superCache, ToolsFactory) {
    var cache = superCache.get('backgrounds');


    $scope.get_backgrounds = function () {
        if (cache) {
            setBackground(cache);
        } else {
            ToolsFactory.getBackgrounds().then(function (data) {
                setBackground(data);
                superCache.put('backgrounds', data);
            }, function () {
                console.log("No background from server");
            });
        }
    };

    function setBackground(data) {
        var index = Math.floor((Math.random() * data.length));
        $("html").css("background-image", "url('media/img/backgrounds/" + data[index] + "')");
    }
}]);