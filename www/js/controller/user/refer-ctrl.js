app.controller('ReferCtrl', ['$scope', '$state', function($scope, $state){

	firebase.database
	$scope.showReferDetails = function(){
		$state.go('referralDetails');
	}

}]);
