app.controller('ReferCtrl', ['$scope', '$state', function($scope, $state){

	$scope.showReferDetails = function(){
		$state.go('referralDetails');
	}

}]);
