angular.module('storecontrol').controller('CustomerListController', ['$scope', '$controller', '$timeout', 'DbService', function($scope, $controller, $timeout, DbService) {

  angular.extend(this, $controller('ListController', {
    $scope: $scope,
    $collection: DbService.getCollection('customers')
  }));

}]);
