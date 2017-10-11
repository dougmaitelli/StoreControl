angular.module("storecontrol", ['ui.router', 'bcherny/formatAsCurrency']).config([
  '$httpProvider',
  '$stateProvider',
  '$urlRouterProvider',
  function($httpProvider, $stateProvider, $urlRouterProvider) {

		$stateProvider.state('home', {
			url: "/",
      views: {
        '': {
          templateUrl : 'views/home.html',
		      controller : 'HomeController'
        }
      }
    }).state('customerList', {
      url: "/customer",
      views: {
        '': {
          templateUrl : 'views/customer/customerList.html',
          controller : 'CustomerListController'
        }
      }
    }).state('newCustomer', {
      url: "/customer/new",
      views: {
        '': {
          templateUrl : 'views/components/form.html',
          controller : 'NewCustomerController'
        }
      }
    }).state('editCustomer', {
      url: "/customer/:id",
      views: {
        '': {
          templateUrl : 'views/components/form.html',
          controller : 'NewCustomerController'
        }
      }
    }).state('productList', {
      url: "/product",
      views: {
        '': {
          templateUrl : 'views/product/productList.html',
          controller : 'ProductListController'
        }
      }
    }).state('newProduct', {
      url: "/product/new",
      views: {
        '': {
          templateUrl : 'views/components/form.html',
          controller : 'NewProductController'
        }
      }
    }).state('editProduct', {
      url: "/product/:id",
      views: {
        '': {
          templateUrl : 'views/components/form.html',
          controller : 'NewProductController'
        }
      }
    }).state('newSelling', {
      url: "/selling/new",
      views: {
        '': {
          templateUrl : 'views/selling/newSelling.html',
          controller : 'NewSellingController'
        }
      }
    });

		$urlRouterProvider.otherwise('/');
  }
]).directive('currency', function () {
    return {
        require: 'ngModel',
        link: function(elem, $scope, attrs, ngModel){
            ngModel.$formatters.push(function(val){
                return '$' + val
            });
            ngModel.$parsers.push(function(val){
                return val.replace(/^\$/, '')
            });
        }
    }
});
