angular.module('storecontrol', ['ui.router']).config([
  '$httpProvider',
  '$stateProvider',
  '$urlRouterProvider',
  function ($httpProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/',
      views: {
        '': {
          templateUrl: 'views/home.html',
		      controller: 'HomeController'
        }
      }
    }).state('customerList', {
      url: '/customer',
      views: {
        '': {
          templateUrl: 'views/customer/customerList.html',
          controller: 'CustomerListController'
        }
      }
    }).state('newCustomer', {
      url: '/customer/new',
      views: {
        '': {
          templateUrl: 'views/components/form.html',
          controller: 'NewCustomerController'
        }
      }
    }).state('editCustomer', {
      url: '/customer/:id',
      views: {
        '': {
          templateUrl: 'views/components/form.html',
          controller: 'NewCustomerController'
        }
      }
    }).state('productList', {
      url: '/product',
      views: {
        '': {
          templateUrl: 'views/product/productList.html',
          controller: 'ProductListController'
        }
      }
    }).state('newProduct', {
      url: '/product/new',
      views: {
        '': {
          templateUrl: 'views/components/form.html',
          controller: 'NewProductController'
        }
      }
    }).state('editProduct', {
      url: '/product/:id',
      views: {
        '': {
          templateUrl: 'views/components/form.html',
          controller: 'NewProductController'
        }
      }
    }).state('newSelling', {
      url: '/selling/new',
      views: {
        '': {
          templateUrl: 'views/selling/newSelling.html',
          controller: 'NewSellingController'
        }
      }
    });

    $urlRouterProvider.otherwise('/');
  }
]).directive('currency', ['$filter', function ($filter) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    link(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(val => {
        if (typeof val === 'undefined' || val === null) {
          return;
        }

        return $filter('currency')(val);
      });

      scope.$watch(() => {
        return ngModel.$modelValue;
      }, () => {
        ngModel.$setViewValue($filter('currency')(ngModel.$modelValue));
        ngModel.$render();
      });

      ngModel.$parsers.push(val => {
        if (typeof val === 'undefined' || val === null) {
          return;
        }

        const pos = val.length - val.indexOf('.') - 3;

        val = Number(val.replace(/[^0-9.-]+/g, '')) * Math.pow(10, pos);

        return val;
      });
    }
  };
}]);
