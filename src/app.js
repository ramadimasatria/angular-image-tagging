angular.module('app', ['imageTagging'])
.controller('appCtrl', ['$scope', function($scope){
	$scope.image = 'example-img.jpg';

	$scope.items = [];
}]);
