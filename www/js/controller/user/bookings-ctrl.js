app.controller('BookingsCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$rootScope,$cordovaToast){


	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	$scope.bookingIds = [];
	$scope.allBookings = [];
	$scope.activeBookingId = '';

	// All the booking id for cancelled booking and active booking and their detail

	$scope.bookingInfo = function() {
		$ionicLoading.show();
		firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
			if(response.val()){
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
								$scope.bookingAddress = response.val().address;
								$ionicLoading.hide();
							});

						}
					});
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
			template: '* Wallet amount only refundable, if booking is cancelled before 2 hour of appointment time.'
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
						delete window.localStorage.currentBooking;
						delete window.localStorage.activeBooking;
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
						delete window.localStorage.currentBooking;
						delete window.localStorage.activeBooking;

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