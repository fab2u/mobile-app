app.controller('LocationCtrl', function($state, $scope,$timeout,$rootScope,$ionicLoading) {

	$scope.show = function() {
		$ionicLoading.show({
			template: 'Loading...'
		})
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
        		$state.go('app.home');
        	}, 500);
    };

});