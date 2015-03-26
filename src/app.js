angular.module('app', ['imageTagging'])
.controller('appCtrl', ['$scope', 'TagItem', function($scope, TagItem){
	$scope.image = 'example-img.jpg';

	$scope.tagItemSvc = TagItem;

	$scope.$watchCollection('tagItemSvc.getItems', function (newVal, oldVal) {
		$scope.items = TagItem.getItems();
	});
}]);
