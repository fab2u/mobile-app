app.controller('LocationCtrl', function($state, $scope,$timeout,$rootScope,$ionicHistory,
										$ionicModal,$ionicLoading) {

	function location() {
		$ionicLoading.show();
		firebase.database().ref('city').once('value',function(response){
			$scope.location_list = response.val();
			if($scope.location_list){
				$ionicLoading.hide();
			}
		});
	}
	location();

	$scope.backButtonValue = false;

	if($ionicHistory.backView().stateName == 'app.home'){
		$scope.backButtonValue = true;
	}

    $scope.backButton = function(){
        $state.go('app.home');
    };

    $scope.selected_city = function(city){
    	$scope.cityId = city.cityId;
        	$timeout( function() {
				$scope.open_location();
        	}, 500);
    };
	$scope.location_selected = function(val){
		var selectedLocation = JSON.parse(window.localStorage['selectedLocation'] || '{}');
		selectedLocation.cityId = val.cityId;
		selectedLocation.cityName	= val.cityName;
		selectedLocation.latitude = val.latitude;
		selectedLocation.longitude = val.longitude;
		selectedLocation.state = val.state;
		selectedLocation.country = val.country;
		selectedLocation.locationName = val.locationName;
		window.localStorage['selectedLocation'] = JSON.stringify(selectedLocation);
		$rootScope.$broadcast('location', { message: 'location changed' });
		$timeout( function() {
			$scope.location.hide();
			$state.go('app.home');
		}, 500);
	};
	$ionicModal.fromTemplateUrl('templates/home/locality.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.location = modal;
	});
	$scope.open_location = function() {
		$ionicLoading.show();
		firebase.database().ref('location/' + $scope.cityId).once('value', function (response) {
			$scope.location_detail = response.val();
			$scope.location.show();
			$ionicLoading.hide();
		});
	};
	$scope.close_location = function() {
		$scope.location.hide();
	};

});