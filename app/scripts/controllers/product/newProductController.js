angular.module('storecontrol').controller('NewProductController', ['$scope', '$timeout', '$stateParams', '$state', 'DbService', function($scope, $timeout, $stateParams, $state, DbService) {

  var collection = DbService.getCollection('products');

  $scope.data = {};

  $timeout(function() {
    $('#form').form({
      onSuccess: function(evt) {
        $scope.save();
        evt.preventDefault();
      },
      fields: {
        name: {
          identifier: 'name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Favor informar Nome'
            }
          ]
        }
      }
    });

    if ($stateParams.id) {
      $(".ui.loadingIndicator").addClass("active");

      collection.findOne({
        _id: $stateParams.id
      }, function(err, result) {
        $timeout(function() {
          $scope.data = result;

          $timeout(function() {
            $('.ui.dropdown').dropdown();
            $(".ui.loadingIndicator").removeClass("active");
          }, 100);
        }, 0);
      });
    }
  }, 0);

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
        $state.go("productList");
      });
    };

    if (!$scope.data._id) {
      collection.insert($scope.data, successCallback);
    } else {
      collection.update({_id: $scope.data._id}, $scope.data, successCallback);
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
      collection.remove({_id: $scope.data._id}, function(err) {
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
