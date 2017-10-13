angular.module('storecontrol').controller('NewProductController', ['$scope', '$controller', '$timeout', 'DbService', function($scope, $controller, $timeout, DbService) {

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

  angular.extend(this, $controller('FormController', {
    $scope: $scope,
    $collection: DbService.getCollection('products'),
    $fields: fields,
    $parentScreen: 'productList'
  }));

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

    $scope.generateChart();
  };

  function getSellingTotalPerMonth(month, year) {
    var sellingsCollection = DbService.getCollection('sellings');

    var totalSellings = 0;

    var oDeferred = $.Deferred();
    sellingsCollection.find({'items.productId': $scope.data._id, created_on: {$gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1)}}).exec(function(err, sellings) {
      sellings.forEach(function(selling) {
        selling.items.forEach(function(item) {
          if (item.productId === $scope.data._id) {
            totalSellings += item.quantity;
          }
        });
      });

      oDeferred.resolve(totalSellings);
    });

    return oDeferred.promise();
  }

  $scope.generateChart = function() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    var calculations = [getSellingTotalPerMonth(month - 2, year), getSellingTotalPerMonth(month - 1, year), getSellingTotalPerMonth(month, year)];

    $.when.apply($, calculations).then(function(totalSellings) {
      var config = {
          type: 'line',
          data: {
              labels: [(month - 2) + '/' + year, (month - 1) + '/' + year, month + '/' + year],
              datasets: [{
                  label: "Vendas",
                  fill: true,
                  backgroundColor: "rgb(54, 162, 235)",
                  borderColor: "rgb(54, 162, 235)",
                  data: [arguments[0], arguments[1], arguments[2]]
              }]
          },
          options: {
              responsive: true,
              tooltips: {
                  mode: 'index',
                  intersect: false,
              },
              hover: {
                  mode: 'nearest',
                  intersect: true
              },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      };

      var ctx = document.getElementById("canvas").getContext("2d");
      new Chart(ctx, config);
    });
  };

}]);
