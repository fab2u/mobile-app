app.controller('BookingsCtrl', function($scope,$state,$ionicLoading){


	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	$scope.bookingIds = [];

	$scope.allBookings = [];

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
			angular.forEach(response.val(), function (value, key) {
				angular.forEach(value, function (value, key) {
					console.log(JSON.stringify(value));
					$scope.bookingIds.push(value.bookingId)
				});
			});
			console.log("booking id for a particular user", $scope.bookingIds);
			console.log("length of bookings for an user", $scope.bookingIds.length);

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
// console.log("aalla",$scope.allBookings)
// 		});
// 		firebase.database().ref('bookings').once('value', function (response) {
// 			$scope.Bookings = response.val();
// 			    if ($scope.Bookings) {
// 					$ionicLoading.hide();
// 				}
// 				else if (!$scope.Bookings) {
// 					$ionicLoading.hide();
// 				}
// 			if(response.val()){
// 				firebase.database().ref('vendors/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")).once
// 				('value',function(response){
// 					$scope.bookingAddress = response.val().address
// 				});
// 			}
// 		});
	};


	$scope.bookingInfo();

	$scope.go_home = function () {
		$state.go('app.home')
	};

	$scope.bookingCancel = function(bookingId){

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