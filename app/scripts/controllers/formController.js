angular.module('storecontrol').controller('FormController', ['$scope', '$controller', '$timeout', '$stateParams', '$state', '$collection', '$fields', '$parentScreen', function($scope, $controller, $timeout, $stateParams, $state, $collection, $fields, $parentScreen) {

  $scope.data = {};

  $scope.fields = $fields;

  angular.extend(this, $controller('BaseController', {
    $scope: $scope
  }));

  $scope.initModel = function() {
    $fields.forEach(function(block) {
      block.forEach(function(field) {
        if (!field.initialValue) {
          field.initialValue = null;

          if (field.type === 'number' || field.type === 'price' || field.type === 'percent') {
            field.initialValue = 0;
          }
        }

        $scope.data[field.name] = field.initialValue;
      });
    });
  };

  $scope.initModel();

  $scope.$watch('data', function(newVal, oldVal) {
    if ($scope.afterChanges) {
      $scope.afterChanges(newVal, oldVal);
    }
  }, true);

  $timeout(function() {
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
