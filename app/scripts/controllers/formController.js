angular.module('storecontrol').controller('FormController', ['$scope', '$timeout', '$stateParams', '$state', '$collection', '$fields', '$parentScreen', function($scope, $timeout, $stateParams, $state, $collection, $fields, $parentScreen) {

  $scope.data = {};

  $scope.fields = $fields;

  $timeout(function() {
    $('.mask.cpf').mask('000.000.000-00', {reverse: true});
    $('.mask.number').mask('000000000000', {reverse: true});
    $('.mask.date').mask('00/00/0000');
    $('.mask.percent').mask('000', {reverse: true});

    $('#form').form({
      onSuccess: function(evt) {
        $scope.save();
        evt.preventDefault();
      },
      fields: buildFieldRules()
    });

    if ($stateParams.id) {
      $(".ui.loadingIndicator").addClass("active");

      $collection.findOne({
        _id: $stateParams.id
      }, function(err, result) {
        $timeout(function() {
          $scope.data = result;

          if ($scope.afterLoad) {
            $scope.afterLoad($scope.data);
          }

          $timeout(function() {
            $('.ui.dropdown').dropdown();
            $(".ui.loadingIndicator").removeClass("active");
          }, 100);
        }, 0);
      });
    }
  }, 0);

  function buildFieldRules() {
    var rules = {};

    $fields.forEach(function(block) {
      block.forEach(function(field) {
        if (field.rules && field.rules.length > 0) {
          rules[field.name] = {
            identifier: field.name,
            rules: field.rules
          };
        }
      });
    });

    return rules;
  }

  $scope.numberToWord = function(number) {
    var numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

    return numbers[(number % 10) - 1];
  };

  $scope.save = function() {
    if (!$('#form').form('is valid')) {
      return;
    }

    var successCallback = function(err, result) {
      $timeout(function() {
        $scope.data._id = $scope.data._id;
      }, 0);

      swal({
        title: "Sucesso!",
        text: "Registro salvo com sucesso!",
        type: "success"
      }, function() {
        $state.go($parentScreen);
      });
    };

    if (!$scope.data._id) {
      $collection.insert($scope.data, successCallback);
    } else {
      $collection.update({_id: $scope.data._id}, $scope.data, successCallback);
    }
  };

  $scope.delete = function() {
    swal({
      title: "Você tem certeza?",
      text: "Esta ação não poderá ser desfeita!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim, deletar!",
      closeOnConfirm: false
    }, function() {
      $collection.remove({_id: $scope.data._id}, function(err) {
        swal({
          title: "Deletado!",
          text: "O registro foi deletado.",
          type: "success"
        }, function() {
          $state.go("productList");
        });
      });
    });
  };

}]);
