angular.module("storecontrol", ['ui.router']).config([
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
          templateUrl : 'views/customer/newCustomer.html',
          controller : 'NewCustomerController'
        }
      }
    }).state('editCustomer', {
      url: "/customer/:id",
      views: {
        '': {
          templateUrl : 'views/customer/newCustomer.html',
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
          templateUrl : 'views/product/newProduct.html',
          controller : 'NewProductController'
        }
      }
    }).state('editProduct', {
      url: "/product/:id",
      views: {
        '': {
          templateUrl : 'views/product/newProduct.html',
          controller : 'NewProductController'
        }
      }
    });

		$urlRouterProvider.otherwise('/');
  }
]);
