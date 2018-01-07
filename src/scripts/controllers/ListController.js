import BaseController from "./BaseController";

import $ from "jquery";
import swal from "sweetalert";

export default class ListController extends BaseController {
  constructor($scope, $timeout, $collection) {
    super($scope, $timeout);

    $scope.searchTerms = {};
    $scope.searchResults = [];

    $scope.numberOfPagesToDisplay = 7;
    $scope.pageRangeToDisplay = Math.floor($scope.numberOfPagesToDisplay / 2);

    $scope.totalPerPage = 10;
    $scope.currentPage = 1;
    $scope.totalPages = 0;

    let processedTerms = {};

    const buildTerms = () => {
      const terms = {};

      for (const termName in $scope.searchTerms) {
        if (
          Object.prototype.hasOwnProperty.call($scope.searchTerms, termName)
        ) {
          const termValue = $scope.searchTerms[termName];
          if (termValue) {
            terms[termName] = new RegExp(termValue, "i");
          }
        }
      }

      processedTerms = terms;
    };

    $scope.doSearch = function() {
      buildTerms();

      $collection.count(processedTerms, (err, count) => {
        $scope.totalPages = Math.ceil(count / $scope.totalPerPage);

        $scope.updatePage(1);
      });
    };

    $scope.getPageArrayRange = () => {
      const pageArray = [];

      const startPage = Math.min(
        Math.max($scope.currentPage - $scope.pageRangeToDisplay, 1),
        Math.max($scope.totalPages - $scope.numberOfPagesToDisplay + 1, 1)
      );

      const numberOfPagesToDisplay = Math.min(
        $scope.numberOfPagesToDisplay,
        $scope.totalPages
      );

      for (let i = 0; i < numberOfPagesToDisplay; i++) {
        pageArray.push(startPage + i);
      }

      return pageArray;
    };

    $scope.updatePage = pageNumber => {
      if (pageNumber < 1 || pageNumber > $scope.totalPages) {
        return;
      }

      $scope.currentPage = pageNumber;

      $(".resultTable .loadingIndicator").addClass("active");

      $collection
        .find(processedTerms)
        .skip($scope.totalPerPage * ($scope.currentPage - 1))
        .limit($scope.totalPerPage)
        .exec((err, items) => {
          $timeout(() => {
            $scope.searchResults = items;

            $(".resultTable .loadingIndicator").removeClass("active");
          }, 0);
        });
    };

    $scope.prevPage = () => {
      $scope.updatePage($scope.currentPage - 1);
    };

    $scope.nextPage = () => {
      $scope.updatePage($scope.currentPage + 1);
    };

    $scope.delete = id => {
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
          $collection.remove({ _id: id }, err => {
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
