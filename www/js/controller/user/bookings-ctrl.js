app.controller('BookingsCtrl', ['$scope','$state', function($scope,$state){

	$scope.Bookings = [
		{salonName: 'Saundarya Hair Clinic Spa', landmark: 'Near Global School', bookingId: 'MK33P0', amount: '500', date: '12th June', time: '11:00'},
		{salonName: 'Saundarya Hair Clinic Spa', landmark: 'Near Global School', bookingId: 'MK33P0', amount: '500', date: '12th June', time: '11:00'},
		{salonName: 'Saundarya Hair Clinic Spa', landmark: 'Near Global School', bookingId: 'MK33P0', amount: '500', date: '12th June', time: '11:00'},
		{salonName: 'Saundarya Hair Clinic Spa', landmark: 'Near Global School', bookingId: 'MK33P0', amount: '500', date: '12th June', time: '11:00'}
	];

	$scope.go_home = function () {
		$state.go('app.home')
	};

}]);