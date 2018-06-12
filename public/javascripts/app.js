'use strict';

// Declare app level module which depends on views, and components
angular.module('cnBetaApp', ['ngRoute']).config(['$routeProvider',
function($routeProvider) {
	$routeProvider.when('/main', {
		templateUrl : 'partials/main/main.html',
		controller : 'MainCtrl'
	}).otherwise({
		redirectTo: '/main'
	});
}]);
