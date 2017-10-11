angular.module('storecontrol').controller('NewSellingController', ['$scope', '$controller', '$timeout', '$state', 'DbService', function($scope, $controller, $timeout, $state, DbService) {

  var productCollection = DbService.getCollection('products');

  $scope.searchTerm = null;
  $scope.suggestionItems = [];

  $scope.selling = {
    customerCpf: null,
    items: [],
    totalPrice: 0
  };

  $timeout(function() {
    $('.mask.cpf').mask('000.000.000-00', {reverse: true});
  }, 0);

  $scope.search = function() {
    if (!$scope.searchTerm || $scope.searchTerm.length < 3) {
      $scope.suggestionItems = [];
      return;
    }

    productCollection.find({$or: [{code: new RegExp($scope.searchTerm, 'i')}, {name: new RegExp($scope.searchTerm, 'i')}]}).exec(function(err, products) {
      $timeout(function () {
        $scope.suggestionItems = products;
      }, 0);
    });
  };

  $scope.add = function(product) {
    $scope.selling.items.push({
      productId: product._id,
      code: product.code,
      name: product.name,
      price: product.price,
      discount: 0,
      quantity: 1,
      totalPrice: product.price
    });

    $scope.updatePrices();
  };

  $scope.delete = function(index) {
    $scope.selling.items.splice(index, 1);
    $scope.updatePrices();
  };

  $scope.updatePrices = function() {
    var totalPrice = 0;

    $scope.selling.items.forEach(function(item) {
      item.totalPrice = (item.price - (item.price * item.discount / 100)) * item.quantity;
      totalPrice += item.totalPrice;
    });

    $scope.selling.totalPrice = totalPrice;
  };

  $scope.confirm = function() {
    var collection = DbService.getCollection('sellings');

    $scope.selling.created_on = new Date();

    collection.insert($scope.selling, function(err, result) {
      swal({
        title: "Sucesso!",
        text: "Registro salvo com sucesso!",
        type: "success"
      }, function() {
        $state.go('home');
      });
    });
  };

}]);
