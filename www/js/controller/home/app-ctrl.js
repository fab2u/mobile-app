app
.controller('AppCtrl', ['$scope','$state', function($scope,$state) {
	console.log("App Controller");

	$scope.liked = false;

	// $scope.likePage = function(){
	// 	$scope.liked =!$scope.liked;
	// }

	$scope.location = "Gurgaon";

	$scope.uid = window.localStorage.getItem("uid");

	$scope.search_text = function(){
		$state.go('search');
	};

	$scope.location_option = function(){
		$state.go('location');
	};
	$scope.favorate_list = function(){
		$state.go('favorate');
	};

}]);