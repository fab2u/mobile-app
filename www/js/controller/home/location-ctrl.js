app.controller('LocationCtrl', function($state, $scope,$timeout) {
    firebase.database().ref('city').once('value',function(response){
        $scope.location_list = response.val();
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
        	$timeout( function() {
        		$state.go('app.home');
        	}, 500);
    };

});