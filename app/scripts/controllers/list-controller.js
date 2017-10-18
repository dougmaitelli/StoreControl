angular.module('storecontrol').controller('ListController', ['$scope', '$controller', '$timeout', '$collection', function ($scope, $controller, $timeout, $collection) {
  $scope.searchTerms = {};
  $scope.searchResults = [];

  $scope.numberOfPagesToDisplay = 7;
  $scope.pageRangeToDisplay = Math.floor($scope.numberOfPagesToDisplay / 2);

  $scope.totalPerPage = 10;
  $scope.currentPage = 1;
  $scope.totalPages = 0;

  angular.extend(this, $controller('BaseController', {
    $scope
  }));

  let processedTerms = {};

  function buildTerms() {
    const terms = {};

    for (const termName in $scope.searchTerms) {
      if (Object.prototype.hasOwnProperty.call($scope.searchTerms, termName)) {
        const termValue = $scope.searchTerms[termName];
        if (termValue) {
          terms[termName] = new RegExp(termValue, 'i');
        }
      }
    }

    processedTerms = terms;
  }

  $scope.doSearch = function () {
    buildTerms();

    $collection.count(processedTerms, (err, count) => {
      $scope.totalPages = Math.ceil(count / $scope.totalPerPage);

      $scope.updatePage(1);
    });
  };

  $scope.getPageArrayRange = function () {
    const pageArray = [];

    const startPage = Math.min(Math.max($scope.currentPage - $scope.pageRangeToDisplay, 1), Math.max($scope.totalPages - $scope.numberOfPagesToDisplay + 1, 1));

    const numberOfPagesToDisplay = Math.min($scope.numberOfPagesToDisplay, $scope.totalPages);

    for (let i = 0; i < numberOfPagesToDisplay; i++) {
      pageArray.push(startPage + i);
    }

    return pageArray;
  };

  $scope.updatePage = function (pageNumber) {
    if (pageNumber < 1 || pageNumber > $scope.totalPages) {
      return;
    }

    $scope.currentPage = pageNumber;

    $('.resultTable .loadingIndicator').addClass('active');

    $collection.find(processedTerms).skip($scope.totalPerPage * ($scope.currentPage - 1)).limit($scope.totalPerPage).exec((err, items) => {
      $timeout(() => {
        $scope.searchResults = items;

        $('.resultTable .loadingIndicator').removeClass('active');
      }, 0);
    });
  };

  $scope.prevPage = function () {
    $scope.updatePage($scope.currentPage - 1);
  };

  $scope.nextPage = function () {
    $scope.updatePage($scope.currentPage + 1);
  };

  $scope.delete = function (id) {
    swal({
      title: 'Você tem certeza?',
      text: 'Esta ação não poderá ser desfeita!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Sim, deletar!',
      closeOnConfirm: false
    }, () => {
      $collection.remove({_id: id}, err => {
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
            $scope.doSearch();
          });
        }
      });
    });
  };
}]);
