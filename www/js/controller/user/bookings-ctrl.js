app.controller('BookingsCtrl', function($scope,$state,$ionicLoading){


	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	$scope.bookingIds = [];
	$scope.allBookings = [];
	$scope.activeBookingId = '';

	// All the booking id for cancelled booking and active booking and their detail

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
			angular.forEach(response.val(), function (value, key) {
				$scope.bookingIds.push(key)
			});
			for (var i = 0; i < $scope.bookingIds.length; i++) {
				firebase.database().ref('bookings/' + $scope.bookingIds[i]).once('value', function (response) {
					if (response.val()) {
						$scope.allBookings.push(response.val())
						$ionicLoading.hide();
						firebase.database().ref('vendors/' + locationInfo.cityId + '/' +response.val().vendorId).once
						('value', function (response) {
							$scope.bookingAddress = response.val().address
							$ionicLoading.hide();
						});

					}
				});
			}

		})
	};
	$scope.bookingInfo();

	$scope.go_home = function () {
		$state.go('app.home')
	};
});