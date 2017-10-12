angular.module('storecontrol').controller('BaseController', ['$scope', '$timeout', function($scope, $timeout) {

  $timeout(function() {
    $('.mask.cpf').mask('000.000.000-00', {reverse: true});
    $('.mask.number').mask('000000000000', {reverse: true});
    $('.mask.date').mask('00/00/0000');
  }, 0);

}]);
