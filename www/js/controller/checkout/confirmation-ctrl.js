app.controller('ConfirmationCtrl', function($scope,$state){
	
	$scope.paidFromWallet = 0;
	$scope.discountedAmount = 12000;
	$scope.totalAmount = 15000;
	$scope.amountPayable = 11900;
	$scope.walletAmount = 100;
	$scope.total_fabtu=0;
	$scope.total_original=0;
	$scope.customer_price = 0;
	$scope.discountedPrice = 0;
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

	$scope.bookingInfo =function (totalFab,totalVendor,totalCustomer) {
		firebase.database().ref('protectedVendorsVersions/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")+'/live/version').once('value',function(response){
        var version = response.val();
			$scope.bookingDetail = {
				'userId':localStorage.getItem('uid'),
				'userName':localStorage.getItem('name'),
				'userMobile':localStorage.getItem('mobileNumber'),
				'cityId':locationInfo.cityId,
				'vendorId':window.localStorage.getItem("vendorId"),
				'totalAmount':totalVendor,
				'serviceInfo':newCart,
				'createdDate':new Date().getTime(),
				'appointmentDate':appointmentDateInfo,
				'appointmentTime':timeOfAppointment,
				'versionNumber':version,
				'status':'upComing',
				'walletAmount':'0',
				'discountPrice':'0',
				'finalAmount':totalCustomer,
				'walletTransId':'0',
				'discountTransId':'0',
				'specialRequest':'updated soon!'
			};
		});
	};
	$scope.calPrice = function (services) {
		$scope.total_fabtu=0;
		$scope.total_original=0;
		$scope.customer_price = 0;
		angular.forEach(cartItems, function(value, key) {
			$scope.total_fabtu += value.fab2uPrice;
			$scope.total_original += value.vendorPrice;
			$scope.customer_price += value.customerPrice;
		});
		$scope.bookingInfo($scope.total_fabtu,$scope.total_original,$scope.customer_price);
	};
	$scope.calPrice(cartItems);

	$scope.confirmedBooking = function(bookingDetails){

		// check the upcoming booking regarding to an user  ///

		firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').once	('value',function(response){
			console.log("valuee",response.val())

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


	};
});

