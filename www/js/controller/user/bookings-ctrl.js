app.controller('BookingsCtrl', function($scope,$state,$ionicLoading){


	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('bookings').once('value', function (response) {
			$scope.Bookings = response.val();
			    if ($scope.Bookings) {
					$ionicLoading.hide();
				}
				else if (!$scope.Bookings) {
					$ionicLoading.hide();
				}
			if(response.val()){
				firebase.database().ref('vendors/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")).once
				('value',function(response){
					$scope.bookingAddress = response.val().address
				});
			}
		});
	};


	$scope.bookingInfo();

	$scope.go_home = function () {
		$state.go('app.home')
	};

	$scope.bookingCancel = function(bookingId){

		console.log("bookingId",bookingId)
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
	};

});