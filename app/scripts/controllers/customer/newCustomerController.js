angular.module('storecontrol').controller('NewCustomerController', ['$scope', '$controller', '$timeout', 'DbService', 'chartService', function($scope, $controller, $timeout, DbService, chartService) {

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

  $scope.extraTemplate = 'customer/newCustomerExtra.html';

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
    $scope.chart = chartService.generateChart(5, 'month', getSellingTotalPerPeriod);
  };

  function getSellingTotalPerPeriod(start, end, oDeferred) {
    var sellingsCollection = DbService.getCollection('sellings');

    var totalExpends = 0;

    sellingsCollection.find({customerCpf: $scope.data.cpf, created_on: {$gte: start, $lte: end}}).exec(function(err, sellings) {
      sellings.forEach(function(selling) {
        totalExpends += selling.totalPrice;
      });

      oDeferred.resolve(totalExpends);
    });
  }

}]);
