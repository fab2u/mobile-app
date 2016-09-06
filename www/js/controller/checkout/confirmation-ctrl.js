app.controller('ConfirmationCtrl', function($scope,$ionicLoading,$state){
	
	$scope.paidFromWallet = 0;
	$scope.amountPayable = 0;
	$scope.walletAmount = 0;
	$scope.total_fabtu=0;
	$scope.walletBalance = 0;
	$scope.total_original=0;
	$scope.customer_price = 0;
	$scope.discountedPrice = 0;
	$scope.subtotal = 0;
	$scope.isChecked = false;
	$scope.amount = 0;

	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	var appointmentDate = JSON.parse(localStorage.getItem('appointmentDate'));

	var timeOfAppointment = window.localStorage.getItem("chosenTime");

	var cartItems = JSON.parse(localStorage.getItem('BegItems'));

	var newCart = [];

	if(cartItems){
		angular.forEach(cartItems, function(value, key) {
			newCart.push(value)
		});
	}

	var appointmentDateInfo = appointmentDate.date + '/'+ appointmentDate.month + '/'+appointmentDate.year;

	// To get the amount information for an user

	$scope.getWalletInfo = function () {
		$ionicLoading.show({
			template: 'Loading...'
		})
		firebase.database().ref('userWallet/data/' + localStorage.getItem('uid')).once('value', function (response) {
			$scope.userWalletInfo = response.val();

			$scope.amount = $scope.userWalletInfo.amount;

			if($scope.userWalletInfo){
				$scope.useWalletAmount();
				$ionicLoading.hide();
			}
			else{
				$ionicLoading.hide();
			}
		})
	};
	$scope.getWalletInfo();


	$scope.bookingInfo =function () {
		console.log($scope.paidFromWallet,$scope.amountPayable)
		console.log($scope.total_fabtu,$scope.total_original,$scope.customer_price)
		firebase.database().ref('protectedVendorsVersions/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")+'/live/version').once('value',function(response){
        var version = response.val();
			$scope.bookingDetail = {
				'userId':localStorage.getItem('uid'),
				'userName':localStorage.getItem('name'),
				'userMobile':localStorage.getItem('mobileNumber'),
				'cityId':locationInfo.cityId,
				'vendorId':window.localStorage.getItem("vendorId"),
				'totalAmount':$scope.total_original,
				'serviceInfo':newCart,
				'createdDate':new Date().getTime(),
				'appointmentDate':appointmentDateInfo,
				'appointmentTime':timeOfAppointment,
				'versionNumber':version,
				'status':'upComing',
				'walletAmount':$scope.paidFromWallet,
				'discountPrice':'0',
				'finalAmount':$scope.customer_price,
				'amountPayable':$scope.amountPayable,
				'walletTransId':'0',
				'discountTransId':'0',
				'specialRequest':'updated soon!'
			};
		});
	};

	// To calculate total amount for pay from cart

	$scope.calPrice = function (services) {
		$scope.total_fabtu=0;
		$scope.total_original=0;
		$scope.customer_price = 0;
		$scope.count = 0;
		angular.forEach(cartItems, function(value, key) {
			$scope.count++;
			$scope.total_fabtu += value.fab2uPrice;
			$scope.total_original += value.vendorPrice;
			$scope.customer_price += value.customerPrice;
		});
		if($scope.count == _.size(cartItems)){
			// $scope.bookingInfo($scope.total_fabtu,$scope.total_original,$scope.customer_price);
			$scope.bookingInfo();
		}
	};
	$scope.calPrice(cartItems);


// To calculate total payable amount after using wallet

	$scope.calculateAmountPayable = function() {
		$scope.isChecked = !$scope.isChecked;
		if ($scope.isChecked == true) {
			$scope.paidFromWallet = $scope.walletAmount;
			$scope.amountPayable = Math.abs($scope.subtotal - $scope.walletAmount);
			$scope.amount = $scope.userWalletInfo.amount - $scope.walletAmount;
			$scope.bookingInfo();
			if ($scope.amountPayable < 0) {
				$scope.amountPayable = 0;
			}
		} else {
			$scope.paidFromWallet = 0;
			$scope.amount = $scope.userWalletInfo.amount;

			$scope.amountPayable = Math.abs($scope.subtotal);
		}
	};

	// Calculate the amount for using in a booking from wallet

	$scope.useWalletAmount = function () {
		console.log($scope.isChecked,$scope.userWalletInfo.amount,$scope.customer_price)
	   $scope.subtotal = $scope.customer_price;
		if ($scope.userWalletInfo.amount > 0) {
			if (($scope.subtotal) > $scope.userWalletInfo.amount) {
				var amount1 = parseInt(($scope.subtotal) / 2);
				console.log(amount1);
				var amount2 = $scope.userWalletInfo.amount;
				var balance = 0;
				if (amount1 < amount2) {
					balance = amount1;
				} else {
					balance = amount2;
				}
				if (balance > 200) {
					$scope.walletAmount = 200;
				} else {
					$scope.walletAmount = balance;
				}
				// $scope.walletAmount = $scope.walletBalance;
			} else {
				var amount1 = parseInt(($scope.subtotal) / 2);
				console.log(amount1);
				var amount2 = $scope.userWalletInfo.amount;
				var balance = 0;
				if (amount1 < amount2) {
					balance = amount1;
				} else {
					balance = amount2;
				}
				if (balance > 200) {
					$scope.walletAmount = 200;
				} else {
					$scope.walletAmount = balance;
				}
				// $scope.walletAmount = ($scope.finalCart.subtotal-$scope.discountAmount);
			}
			$scope.useWalletAmount = true;
		} else {
			$scope.useWalletAmount = 0;
		}
		console.log('wallet amount is ' + $scope.walletAmount);
	};


	$scope.confirmedBooking = function(bookingDetails){
		// check user is logged in or not
		if((localStorage.getItem('uid') == null) ||(localStorage.getItem('uid')== undefined)){
			localStorage.setItem('confirmation', true);
			$state.go('login');
		}
		else{
			// check the upcoming booking regarding to an user  ///
			firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').once	('value',function(response){
				if(!response.val()){
					var bookingId = firebase.database().ref('bookings').push().key;
					bookingDetails['bookingId']=bookingId;
					firebase.database().ref('bookings/'+bookingId)
						.set(bookingDetails,function(response) {
						console.log("booking", JSON.stringify(response));
						if(response == null){
							firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').push({
								'bookingId':bookingId
							},function(response) {
								console.log("booking user", JSON.stringify(response));
							})
							firebase.database().ref('cityBookings/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId"))
								.push({
								'bookingId':bookingId

							},function(response) {
								console.log("booking city", JSON.stringify(response));
							})
							firebase.database().ref('vendorBookings/'+window.localStorage.getItem("vendorId")+'/active')
								.push({
									'bookingId':bookingId

								},function(response) {
									console.log("booking vendor", JSON.stringify(response));
								})
							alert('Booking confirmed!');
							$state.go('bill');
						}
						else{
							alert('Try again!');
						}
					})
				}
				else{
					alert('Availed your previous booking first!')
				}
			});
		}
	};
});

