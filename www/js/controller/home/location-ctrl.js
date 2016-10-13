app.controller('LocationCtrl', function($state, $scope,$timeout,$rootScope,$ionicModal,$ionicLoading) {

	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();

    firebase.database().ref('city').once('value',function(response){
        $scope.location_list = response.val();
		if($scope.location_list){
			$ionicLoading.hide();
		}
    });

    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.selected_city = function(city){
        	var selectedLocation = JSON.parse(window.localStorage['selectedLocation'] || '{}');
        	selectedLocation.cityId = city.cityId;
        	selectedLocation.cityName	= city.cityName;
        	selectedLocation.latitude = city.latitude;
        	selectedLocation.longitude = city.longitude;
        	selectedLocation.state = city.state;
        	selectedLocation.country = city.country;
        	window.localStorage['selectedLocation'] = JSON.stringify(selectedLocation);
		  $rootScope.$broadcast('location', { message: 'location changed' });
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
		window.localStorage['selectedLocation'] = JSON.stringify(selectedLocation);
		$rootScope.$broadcast('location', { message: 'location changed' });
		console.log("selected Location options :",val);
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
		firebase.database().ref('location/' + JSON.parse(window.localStorage['selectedLocation']).cityId).once('value', function (response) {
			$scope.location_detail = response.val();
			console.log("location",JSON.stringify($scope.location_detail,null,2))
			$scope.location.show();
			$ionicLoading.hide();
		});

	};
	$scope.close_location = function() {
		$scope.location.hide();
	};

});