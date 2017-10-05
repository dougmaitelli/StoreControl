angular.module('storecontrol').controller('ProductListController', ['$scope', '$timeout', 'DbService', function($scope, $timeout, DbService) {

  var collection = DbService.getProductCollection();

  $scope.searchTerms = {};
  $scope.searchResults = [];

  $scope.numberOfPagesToDisplay = 7;
  $scope.pageRangeToDisplay = Math.floor($scope.numberOfPagesToDisplay / 2);

  $scope.totalPerPage = 10;
  $scope.currentPage = 1;
  $scope.totalPages = 0;

  var processedTerms = {};

  function buildTerms() {
    var terms = {};

    for (var termName in $scope.searchTerms) {
      if ($scope.searchTerms.hasOwnProperty(termName)) {
        var termValue = $scope.searchTerms[termName];
        if (termValue) {
          terms[termName] = new RegExp(termValue, 'i');
        }
      }
    }

    processedTerms = terms;
  }

  $scope.doSearch = function() {
    buildTerms();

    collection.count(processedTerms, function(err, count) {
      $scope.totalPages = Math.ceil(count / $scope.totalPerPage);

      $scope.updatePage(1);
    });
  };

  $scope.getPageArrayRange = function() {
    var pageArray = [];

    var startPage = Math.min(Math.max($scope.currentPage - $scope.pageRangeToDisplay, 1), Math.max($scope.totalPages - $scope.numberOfPagesToDisplay + 1, 1));

    var numberOfPagesToDisplay = Math.min($scope.numberOfPagesToDisplay, $scope.totalPages);

    for (var i = 0; i < numberOfPagesToDisplay; i++) {
      pageArray.push(startPage + i);
    }

    return pageArray;
  };

  $scope.updatePage = function(pageNumber) {
    if (pageNumber < 1 || pageNumber > $scope.totalPages) {
      return;
    }

    $scope.currentPage = pageNumber;

    $(".resultTable .loadingIndicator").addClass("active");

    collection.find(processedTerms).skip($scope.totalPerPage * ($scope.currentPage - 1)).limit($scope.totalPerPage).toArray(function(err, items) {
      $timeout(function() {
        $scope.searchResults = items;

        $(".resultTable .loadingIndicator").removeClass("active");
      }, 0);
    });
  };

  $scope.prevPage = function(pageNumber) {
    $scope.updatePage($scope.currentPage - 1);
  };

  $scope.nextPage = function(pageNumber) {
    $scope.updatePage($scope.currentPage + 1);
  };

  $scope.delete = function(id) {
    swal({
      title: "Você tem certeza?",
      text: "Esta ação não poderá ser desfeita!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim, deletar!",
      closeOnConfirm: false
    }, function() {
      collection.remove({_id: id}, function(err) {
        swal({
          title: "Deletado!",
          text: "O registro foi deletado.",
          type: "success"
        }, function() {
          $scope.doSearch();
        });
      });
    });
  };

}]);
