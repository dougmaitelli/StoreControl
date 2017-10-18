angular.module('storecontrol').controller('NewCustomerController', ['$scope', '$controller', '$timeout', 'DbService', 'chartService', function ($scope, $controller, $timeout, DbService, chartService) {
  const fields = [
    [
      {
        name: 'name',
        type: 'text',
        rules: [
          {
            type: 'empty',
            prompt: 'Favor informar Nome'
          }
        ]
      }, {
        name: 'lastName',
        type: 'text',
        rules: [
          {
            type: 'empty',
            prompt: 'Favor informar Sobrenome'
          }
        ]
      }
    ], [
      {
        name: 'cpf',
        type: 'cpf',
        rules: [
          {
            type: 'empty',
            prompt: 'Favor informar CPF'
          }
        ]
      }, {
        name: 'rg',
        type: 'number'
      }
    ]
  ];

  $scope.extraTemplate = 'customer/newCustomerExtra.html';

  angular.extend(this, $controller('FormController', {
    $scope,
    $collection: DbService.getCollection('customers'),
    $fields: fields,
    $parentScreen: 'customerList'
  }));

  $scope.calculateAge = function (birthdayStr) {
    if (!birthdayStr || birthdayStr.length < 10) {
      return 0;
    }

    birthdayStr = birthdayStr.split('/');
    const birthday = new Date(birthdayStr[2] + '-' + birthdayStr[1] + '-' + birthdayStr[0]);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  $scope.afterLoad = function () {
    $scope.chart = chartService.generateChart(5, 'month', getSellingTotalPerPeriod);
  };

  function getSellingTotalPerPeriod(start, end, oDeferred) {
    const sellingsCollection = DbService.getCollection('sellings');

    let totalExpends = 0;

    sellingsCollection.find({customerCpf: $scope.data.cpf, created_on: {$gte: start, $lte: end}}).exec((err, sellings) => {
      sellings.forEach(selling => {
        totalExpends += selling.totalPrice;
      });

      oDeferred.resolve(totalExpends);
    });
  }
}]);
