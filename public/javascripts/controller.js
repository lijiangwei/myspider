'use strict';

angular.module('cnBetaApp', []).controller("MainCtrl", [
function($scope, $http) {
	$http.post("/queryNewsList", null).success(function(data) {
		$scope.newsList = data.List;
	});
}]);
