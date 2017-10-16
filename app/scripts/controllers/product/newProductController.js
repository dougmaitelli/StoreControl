angular.module('storecontrol').controller('NewProductController', ['$scope', '$controller', '$timeout', 'DbService', 'chartService', function($scope, $controller, $timeout, DbService, chartService) {

  var fields = [
    [
      {
        name: 'code',
        type: 'text',
        rules: [
          {
            type   : 'empty',
            prompt : 'Favor informar Codigo'
          }
        ]
      },{
        name: 'name',
        type: 'text',
        rules: [
          {
            type   : 'empty',
            prompt : 'Favor informar Nome'
          }
        ]
      }
    ],[
      {
        name: 'category',
        type: 'text'
      }
    ],[
      {
        name: 'cost',
        type: 'price'
      },{
        name: 'sellMargin',
        type: 'percent'
      },{
        name: 'price',
        type: 'price'
      }
    ],[
      {
        name: 'totalSellings',
        type: 'number',
        readonly: true
      },{
        name: 'totalSellingsIncome',
        type: 'price',
        readonly: true
      }
    ]
  ];

  $scope.extraTemplate = 'product/newProductExtra.html';

  angular.extend(this, $controller('FormController', {
    $scope: $scope,
    $collection: DbService.getCollection('products'),
    $fields: fields,
    $parentScreen: 'productList'
  }));

  $scope.chartPeriod = 'day';

  function numberIsValid(number) {
    return typeof number != undefined && number != null && !isNaN(number);
  }

  $scope.afterChanges = function(newVal, oldVal) {
    if (numberIsValid(newVal.cost) && numberIsValid(newVal.price) && (oldVal.cost != newVal.cost || oldVal.sellMargin != newVal.sellMargin)) {
      $scope.data.price = newVal.cost + newVal.cost * newVal.sellMargin / 100;
      return true;
    } else if (numberIsValid(newVal.cost) && numberIsValid(newVal.sellMargin) && oldVal.price != newVal.price) {
      $scope.data.sellMargin = (newVal.price - newVal.cost) / newVal.cost * 100;
      return true;
    }

    return false;
  };

  $scope.afterLoad = function(data) {
    var sellingsCollection = DbService.getCollection('sellings');

    data.totalSellings = 0;
    data.totalSellingsIncome = 0;

    sellingsCollection.find({'items.productId': data._id}).exec(function(err, sellings) {
      sellings.forEach(function(selling) {
        selling.items.forEach(function(item) {
          if (item.productId === data._id) {
            data.totalSellings += item.quantity;
            data.totalSellingsIncome += item.totalPrice;
          }
        });
      });
    });

    $scope.redrawChart('day');
  };

  $scope.redrawChart = function(chartPeriod) {
    if ($scope.chart) {
      $scope.chart.destroy();
    }

    $scope.chart = chartService.generateChart(7, chartPeriod, getSellingTotalPerPeriod);
  };

  function getSellingTotalPerPeriod(start, end, oDeferred) {
    var sellingsCollection = DbService.getCollection('sellings');

    var totalSellings = 0;

    sellingsCollection.find({'items.productId': $scope.data._id, created_on: {$gte: start, $lte: end}}).exec(function(err, sellings) {
      sellings.forEach(function(selling) {
        selling.items.forEach(function(item) {
          if (item.productId === $scope.data._id) {
            totalSellings += item.quantity;
          }
        });
      });

      oDeferred.resolve(totalSellings);
    });
  }

}]);
