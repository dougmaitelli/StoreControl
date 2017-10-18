angular.module('storecontrol').controller('FormController', ['$scope', '$controller', '$timeout', '$stateParams', '$state', '$collection', '$fields', '$parentScreen', function ($scope, $controller, $timeout, $stateParams, $state, $collection, $fields, $parentScreen) {
  $scope.data = {};

  $scope.fields = $fields;

  angular.extend(this, $controller('BaseController', {
    $scope
  }));

  $scope.initModel = function () {
    $fields.forEach(block => {
      block.forEach(field => {
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

  $scope.ignoreNextchange = false;
  $scope.$watch('data', (newVal, oldVal) => {
    if ($scope.ignoreNextchange) {
      $scope.ignoreNextchange = false;
      return;
    }

    if ($scope.afterChanges) {
      if ($scope.afterChanges(newVal, oldVal)) {
        $scope.ignoreNextchange = true;
      }
    }
  }, true);

  $timeout(() => {
    $('#form').form({
      onSuccess(evt) {
        $scope.save();
        evt.preventDefault();
      },
      fields: buildFieldRules()
    });

    if ($stateParams.id) {
      $('.ui.loadingIndicator').addClass('active');

      $collection.findOne({
        _id: $stateParams.id
      }, (err, result) => {
        $timeout(() => {
          $scope.data = result;

          if ($scope.afterLoad) {
            $scope.afterLoad($scope.data);
          }

          $timeout(() => {
            $('.ui.dropdown').dropdown();
            $('.ui.loadingIndicator').removeClass('active');
          }, 100);
        }, 0);
      });
    }
  }, 0);

  function buildFieldRules() {
    const rules = {};

    $fields.forEach(block => {
      block.forEach(field => {
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

  $scope.numberToWord = function (number) {
    const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

    return numbers[(number % 10) - 1];
  };

  $scope.save = function () {
    if (!$('#form').form('is valid')) {
      return;
    }

    const successCallback = function (err, result) {
      $timeout(() => {
        $scope.data._id = result._id;
      }, 0);

      swal({
        title: 'Sucesso!',
        text: 'Registro salvo com sucesso!',
        type: 'success'
      }, () => {
        $state.go($parentScreen);
      });
    };

    if (!$scope.data._id) {
      $collection.insert($scope.data, successCallback);
    } else {
      $collection.update({_id: $scope.data._id}, $scope.data, successCallback);
    }
  };

  $scope.delete = function () {
    swal({
      title: 'Você tem certeza?',
      text: 'Esta ação não poderá ser desfeita!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Sim, deletar!',
      closeOnConfirm: false
    }, () => {
      $collection.remove({_id: $scope.data._id}, err => {
        if (err) {
          swal({
            title: 'Erro!',
            text: 'Ocorreu um erro.',
            type: 'error'
          });
        } else {
          swal({
            title: 'Deletado!',
            text: 'O registro foi deletado.',
            type: 'success'
          }, () => {
            $state.go('productList');
          });
        }
      });
    });
  };
}]).directive('formInput', ['$compile', function ($compile) {
  const getTemplate = function (field) {
    switch (field.type) {
      default: case 'text': return '<input type="text" name="{{field.name}}" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
      case 'cpf': return '<input type="text" name="{{field.name}}" class="mask cpf" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
      case 'number': return '<input type="text" name="{{field.name}}" class="mask number" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
      case 'date': return '<input type="text" name="{{field.name}}" class="mask date" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
      case 'price': return '<input type="text" name="{{field.name}}" ng-model="data[field.name]" currency placeholder="{{field.name}}" ng-readonly="field.readonly">';
      case 'percent': return '<input type="number" name="{{field.name}}" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
    }
  };

  return {
    restrict: 'E',
    link(scope, element) {
      const el = $compile(getTemplate(scope.field))(scope);
      element.replaceWith(el);
    }
  };
}]);
