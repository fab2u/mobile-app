app.controller('BookingsCtrl', function($scope,$state,$ionicLoading){


	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	$scope.bookingIds = [];

	$scope.allBookings = [];
	$scope.activeBookingId = '';

	firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').once('value', function (response) {
		angular.forEach(response.val(), function (value, key) {
			console.log(value.bookingId,key)
			$scope.activeBookingId = value.bookingId;

		});
	})

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
			angular.forEach(response.val(), function (value, key) {
				angular.forEach(value, function (value, key) {
					$scope.bookingIds.push(value.bookingId)
				});
			});
			for (var i = 0; i < $scope.bookingIds.length; i++) {
				firebase.database().ref('bookings/' + $scope.bookingIds[i]).once('value', function (response) {
					if (response.val()) {
						$scope.allBookings.push(response.val())
					}
				});
			}
			firebase.database().ref('vendors/' + locationInfo.cityId + '/' + window.localStorage.getItem("vendorId")).once
			('value', function (response) {
				$scope.bookingAddress = response.val().address
				$ionicLoading.hide();
			});
		})
	};


	$scope.bookingInfo();

	$scope.go_home = function () {
		$state.go('app.home')
	};

	$scope.bookingCancel = function(bookingId){
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').once('value', function (response) {
			angular.forEach(response.val(), function (value, key) {
				console.log(key,value.bookingId);
				if(bookingId == value.bookingId){
					var onComplete = function(error) {
						if (error) {
							console.log('Synchronization failed');
						} else {
							console.log('Synchronization succeeded');
							$scope.bookingInfo();
						}
					};
					firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active/'+key).remove(onComplete)

					 firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/cancelled').push({
						'bookingId':bookingId
					},function(response) {
						console.log("booking user", JSON.stringify(response));
					})
					firebase.database().ref('vendorBookings/'+window.localStorage.getItem("vendorId")+'/cancelled')
						.push({
							'bookingId':bookingId

						},function(response) {
							console.log("booking vendor", JSON.stringify(response));
						})
					alert('Booking cancelled!');
				}
				else{
					alert('Your booking is not upcoming, so you can not cancel it!');
				}

			});
		})
	};

});