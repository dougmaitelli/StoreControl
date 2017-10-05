angular.module('storecontrol').controller('NewCustomerController', ['$scope', '$timeout', '$stateParams', '$state', 'DbService', function($scope, $timeout, $stateParams, $state, DbService) {

  var collection = DbService.getCustomerCollection();

  $scope.data = {};

  $timeout(function() {
    $('.mask.cpf').mask('000.000.000-00', {reverse: true});
    $('.mask.date').mask('00/00/0000');

    $('#form').form({
      onSuccess: function(evt) {
        $scope.save();
        evt.preventDefault();
      },
      fields: {
        cnpj: {
          identifier: 'cpf',
          rules: [
            {
              type   : 'empty',
              prompt : 'Favor informar CPF'
            }
          ]
        },
        name: {
          identifier: 'name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Favor informar Nome'
            }
          ]
        },
        lastname: {
          identifier: 'lastname',
          rules: [
            {
              type   : 'empty',
              prompt : 'Favor informar Sobrenome'
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

  $scope.calculateAge = function(birthdayStr) {
    if (!birthdayStr || birthdayStr.length < 10) {
      return 0;
    }

    birthdayStr = birthdayStr.split("/");
    var birthday = new Date(birthdayStr[2] + '-' + birthdayStr[1] + '-' + birthdayStr[0]);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

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
        $state.go("customerList");
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
          $state.go("customerList");
        });
      });
    });
  };

}]);
