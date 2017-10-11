angular.module('storecontrol').controller('NewCustomerController', ['$scope', '$controller', '$timeout', 'DbService', function($scope, $controller, $timeout, DbService) {

  var fields = [
    [
      {
        name: 'name',
        type: 'text',
        rules: [
          {
            type   : 'empty',
            prompt : 'Favor informar Nome'
          }
        ]
      },{
        name: 'lastName',
        type: 'text',
        rules: [
          {
            type   : 'empty',
            prompt : 'Favor informar Sobrenome'
          }
        ]
      }
    ],[
      {
        name: 'cpf',
        type: 'cpf',
        rules: [
          {
            type   : 'empty',
            prompt : 'Favor informar CPF'
          }
        ]
      },{
        name: 'rg',
        type: 'number'
      }
    ]
  ];

  angular.extend(this, $controller('FormController', {
    $scope: $scope,
    $collection: DbService.getCollection('customers'),
    $fields: fields,
    $parentScreen: 'customerList'
  }));

  $scope.calculateAge = function(birthdayStr) {
    if (!birthdayStr || birthdayStr.length < 10) {
      return 0;
    }

    birthdayStr = birthdayStr.split("/");
    var birthday = new Date(birthdayStr[2] + '-' + birthdayStr[1] + '-' + birthdayStr[0]);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  $scope.afterLoad = function(data) {
    $scope.generateChart();
  };

  function getExpendTotalPerMonth(month, year) {
    var sellingsCollection = DbService.getCollection('sellings');

    var totalExpends = 0;

    var oDeferred = $.Deferred();
    sellingsCollection.find({customerCpf: $scope.data.cpf, created_on: {$gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1)}}).exec(function(err, sellings) {
      sellings.forEach(function(selling) {
        totalExpends += selling.totalPrice;
      });

      oDeferred.resolve(totalExpends);
    });

    return oDeferred.promise();
  }

  $scope.generateChart = function() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    var calculations = [getExpendTotalPerMonth(month - 2, year), getExpendTotalPerMonth(month - 1, year), getExpendTotalPerMonth(month, year)];

    $.when.apply($, calculations).then(function(totalSellings) {
      var config = {
          type: 'line',
          data: {
              labels: [(month - 2) + '/' + year, (month - 1) + '/' + year, month + '/' + year],
              datasets: [{
                  label: "Total Gasto",
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
