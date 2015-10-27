app.factory('ItemsFactory', ['$http', '$q', function ($http, $q) {
    return {
        getItems: function () {
            var deferred = $q.defer();
            $http.get(server + 'items/',  {cache: true})
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

app.controller('ItemsController', ['$scope', '$rootScope', 'superCache', 'ItemsFactory', 'SelectedProperties',
    function ($scope, $rootScope, superCache, ItemsFactory, SelectedProperties) {
        var items_cache = superCache.get('items_cache');

        $scope.create_list_items = function () {
            if (!items_cache) {
                ItemsFactory.getItems().then(function (data) {
                    superCache.put('items_cache', data);
                    $scope.items = data;
                }, function (msg) {
                    console.log("<==== Error ====>");
                });
            } else {
                $scope.items = items_cache;
            }
        };

        $scope.search_item = function (searched) {
            patt = new RegExp(searched.toLowerCase());
            for(i = 0; i < Object.keys($scope.items).length; i++){
                if(!patt.test($scope.items[i].name)){

                }else{
                    console.log($scope.items[i].name.toLowerCase());
                }
            }
        };

        $scope.set_selected = function (item) {
            SelectedProperties.setItemSelected(item);
        };

        $scope.is_selected = function (item) {
            return SelectedProperties.getItemSelected() === item;
        };

        $scope.get_item_selected = function(){
            return SelectedProperties.getItemSelected();
        }
    }]);