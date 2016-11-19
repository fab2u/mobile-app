app.controller('BookingsCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$rootScope,
										$cordovaToast,$timeout){


	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
	if(window.localStorage['allBookingInfo']){
		var allBookingInfo = JSON.parse(window.localStorage['allBookingInfo'])
	}
	else{
		var allBookingInfo = {};
	}

	$scope.bookingIds = [];
	$scope.allBookings = [];
	$scope.activeBookingId = '';

	var count1 = 0;
	var count2 = 0;

	$scope.activeDate = new Date().getTime();
	// All the booking id for cancelled booking and active booking and their detail

	function allBookingsDetail(bookingIds) {
		for (var i = 0; i <bookingIds.length; i++) {
			firebase.database().ref('bookings/' + bookingIds[i]).once('value', function (response) {
				if (response.val()) {
					$scope.allBookings.push(response.val());
					$ionicLoading.hide();
				}
			});
		}
	}

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
			if(response.val()){
				count1 = Object.keys(response.val()).length;
				angular.forEach(response.val(), function (value, key) {
					count2++;
					$scope.bookingIds.push(key)
				});
				if(count1 == count2){
					allBookingsDetail($scope.bookingIds)
					$ionicLoading.hide();
				}
			}
			else{
				$ionicLoading.hide();
			}
		})
	};
	$scope.bookingInfo();

	$scope.go_home = function () {
		$state.go('app.home');
	};

	$scope.bookingDetail = function (id) {
		$state.go('bookingDetail',{bookingId:id});
	};

	$scope.bookingCancel = function(b_id){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Note',
			template: 'Wallet Money is refundable only if booking is cancelled 2 hour prior to Appointment Time'
		});

		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
				console.log(b_id);
				$scope.cancel(b_id);
			} else {
				console.log('You are not sure');
			}
		});
	};

	//////    To check time of cancellation of booking is less than two hour of appointment time ////////////
	$scope.fromDate = new Date();
	$scope.monthName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	$scope.getTimeFormat = function () {

		var bookDateForAppointment = $scope.fromDate.getDate()+'-'+$scope.monthName[$scope.fromDate.getMonth()]+'-'+$scope.fromDate.getFullYear();

		/// add '2' for difference of 2 hour from right now time ////////
		$scope.timeTobe = (new Date().getHours()+2)+':'+new Date().getMinutes();

		$scope.thisCancelTime = toTimestamp(bookDateForAppointment + ' ' + $scope.timeTobe);
	};

	//  To calculate the time stamp for selected date and and current time  ////


	function toTimestamp(thisBookingTime) {
		var datum = Date.parse(thisBookingTime);
		return datum;
	}

	$scope.getTimeFormat();

	$scope.cancel = function(booking_id){
		$ionicLoading.show();
		var updates = {};
		firebase.database().ref('bookings/' + booking_id).once('value', function (response) {
			if(response.val()){
				$scope.bookingInformation = response.val();
				if(($scope.thisCancelTime == $scope.bookingInformation.appointmentTime) || ($scope.thisCancelTime < $scope.bookingInformation.appointmentTime)){
					console.log("refund wallet money if used");
					if($scope.bookingInformation.walletAmount > 0){
						var walletTransactionId = db.ref('userWallet/' + localStorage.getItem('uid')+'/credit').push().key;
						var transactionDetail = {
							'amount': $scope.bookingInformation.walletAmount,
							'transactionId': walletTransactionId,
							'bookingId': $scope.bookingInformation.bookingId,
							'creditDate': new Date().getTime(),
							'type':'userCancelled'
						};
						updates['userWallet/' + localStorage.getItem('uid')+'/credit/'+walletTransactionId] = transactionDetail;
					}
					updates['bookings/'+$scope.bookingInformation.bookingId+'/'+'userStatus'] = 'cancelled';
					updates['userBookings/'+localStorage.getItem('uid')+'/'+$scope.bookingInformation.bookingId] = 'cancelled';
					updates['vendorBookings/'+$scope.bookingInformation.vendorId+'/'+$scope.bookingInformation.bookingId] = 'cancelled';
					db.ref().update(updates).then(function(){
                       ///// delete booking id from local storage ///////
						delete allBookingInfo[$scope.bookingInformation.bookingId];
						window.localStorage['allBookingInfo'] = JSON.stringify(allBookingInfo);
						$state.go('app.home');
						$ionicLoading.hide();
						$cordovaToast
							.show('Your booking is cancelled. Rs.'+ $scope.bookingInformation.walletAmount +'is successfully refunded in your wallet', 'long', 'center')
							.then(function(success) {
								// success
							}, function (error) {
								// error
							});
						$rootScope.$broadcast('booking', { message: 'booking cancelled' });

					});
				}
				else{
					updates['bookings/'+$scope.bookingInformation.bookingId+'/'+'userStatus'] = 'cancelled';
					updates['userBookings/'+localStorage.getItem('uid')+'/'+$scope.bookingInformation.bookingId] = 'cancelled';
					updates['vendorBookings/'+$scope.bookingInformation.vendorId+'/'+$scope.bookingInformation.bookingId] = 'cancelled';
					db.ref().update(updates).then(function(){
						///// delete booking id from local storage ///////
						delete allBookingInfo[$scope.bookingInformation.bookingId];
						window.localStorage['allBookingInfo'] = JSON.stringify(allBookingInfo);
						$state.go('app.home');
						$ionicLoading.hide();
						$cordovaToast
							.show('Your booking is cancelled.', 'long', 'center')
							.then(function(success) {
								// success
							}, function (error) {
								// error
							});
						$rootScope.$broadcast('booking', { message: 'booking cancelled' });

					});
				}

			}
		})
	};

});