'use strict';

var pageSize = 10;
var maxPage = 0;

angular.module('cnBetaApp').controller("MainCtrl", ['$scope','$http',
function($scope, $http) {
	
	$scope.leftNum = 1;
	$scope.rightNum = 5;
	$scope.displayCount = 5;
	
	$scope.queryList = function(currentPage){
		var formData = {
			"currentIndex": (currentPage-1) * pageSize,
			"pageSize": pageSize
		};
		$scope.currentPage = currentPage;
		$http.post("/queryNewsList",formData)
			.success(function(data){
				$scope.newsList = data.List;
				$scope.pageNumber = [];
				maxPage = Math.ceil(data.recordNumber / pageSize);
				for(var i=1; i<=maxPage; i++){
					$scope.pageNumber.push(i);
				}
			});
	};
	
	$scope.changePage = function(direction){
		var leftNum = $scope.leftNum + direction*$scope.displayCount;
		$scope.leftNum = leftNum > 0 ? leftNum : $scope.leftNum;
		var rightNum = $scope.rightNum + direction*$scope.displayCount
		$scope.rightNum = rightNum > $scope.leftNum ? rightNum : $scope.rightNum;
	};
	
	$scope.queryList(1);
	
}]);
