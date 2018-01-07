import BaseController from "./BaseController";

import $ from "jquery";
import swal from "sweetalert";

import jQuery from "jquery";
window.jQuery = jQuery;
require("../../../semantic/dist/components/dropdown");
require("../../../semantic/dist/components/form");

export default class FormController extends BaseController {
  constructor(
    $scope,
    $timeout,
    $stateParams,
    $state,
    $collection,
    $parentScreen
  ) {
    super($scope, $timeout);

    $scope.data = {};

    this.fields = this.getFields();
    $scope.fields = this.fields;

    $scope.initModel = () => {
      this.fields.forEach(block => {
        block.forEach(field => {
          if (!field.initialValue) {
            field.initialValue = null;

            if (
              field.type === "number" ||
              field.type === "price" ||
              field.type === "percent"
            ) {
              field.initialValue = 0;
            }
          }

          $scope.data[field.name] = field.initialValue;
        });
      });
    };

    $scope.initModel();

    $scope.ignoreNextchange = false;
    $scope.$watch(
      "data",
      (newVal, oldVal) => {
        if ($scope.ignoreNextchange) {
          $scope.ignoreNextchange = false;
          return;
        }

        if ($scope.afterChanges) {
          if ($scope.afterChanges(newVal, oldVal)) {
            $scope.ignoreNextchange = true;
          }
        }
      },
      true
    );

    $timeout(() => {
      $("#form").form({
        onSuccess(evt) {
          $scope.save();
          evt.preventDefault();
        },
        fields: buildFieldRules()
      });

      if ($stateParams.id) {
        $(".ui.loadingIndicator").addClass("active");

        $collection.findOne(
          {
            _id: $stateParams.id
          },
          (err, result) => {
            $timeout(() => {
              $scope.data = result;

              if ($scope.afterLoad) {
                $scope.afterLoad($scope.data);
              }

              $timeout(() => {
                $(".ui.dropdown").dropdown();
                $(".ui.loadingIndicator").removeClass("active");
              }, 100);
            }, 0);
          }
        );
      }
    }, 0);

    const buildFieldRules = () => {
      const rules = {};

      this.fields.forEach(block => {
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
    };

    $scope.numberToWord = number => {
      const numbers = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten"
      ];

      return numbers[number % 10 - 1];
    };

    $scope.save = () => {
      if (!$("#form").form("is valid")) {
        return;
      }

      const successCallback = (err, result) => {
        $timeout(() => {
          $scope.data._id = result._id;
        }, 0);

        swal({
          title: "Sucesso!",
          text: "Registro salvo com sucesso!",
          icon: "success"
        }).then(() => {
          $state.go($parentScreen);
        });
      };

      if (!$scope.data._id) {
        $collection.insert($scope.data, successCallback);
      } else {
        $collection.update(
          { _id: $scope.data._id },
          $scope.data,
          successCallback
        );
      }
    };

    $scope.delete = () => {
      swal({
        title: "Você tem certeza?",
        text: "Esta ação não poderá ser desfeita!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancelar",
            value: null,
            visible: true,
            closeModal: true
          },
          confirm: {
            text: "Sim, deletar!",
            value: true,
            visible: true,
            closeModal: false
          }
        }
      }).then(willDelete => {
        if (willDelete) {
          $collection.remove({ _id: $scope.data._id }, err => {
            if (err) {
              swal("Erro!", "Ocorreu um erro.", "error");
            } else {
              swal("Deletado!", "O registro foi deletado.", "success").then(
                () => {
                  $scope.doSearch();
                }
              );
            }
          });
        }
      });
    };
  }
}
