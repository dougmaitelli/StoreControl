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
    });

		$urlRouterProvider.otherwise('/');
  }
]);
