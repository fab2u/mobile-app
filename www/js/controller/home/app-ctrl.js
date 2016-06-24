app
.controller('AppCtrl', ['$scope', function($scope) {
	console.log("App Controller");

	$scope.liked = false;

	$scope.likePage = function(){
		$scope.liked =!$scope.liked;
	}

	$scope.location = "Gurgaon";
}]);