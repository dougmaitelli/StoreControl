angular.module('storecontrol').controller('ProductListController', ['$scope', '$controller', '$timeout', 'DbService', function ($scope, $controller, $timeout, DbService) {
  angular.extend(this, $controller('ListController', {
    $scope,
    $collection: DbService.getCollection('products')
  }));
}]);
