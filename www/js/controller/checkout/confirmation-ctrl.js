app.controller('ConfirmationCtrl', ['$scope', function($scope){
	
	$scope.paidFromWallet = 100;
	$scope.discountedAmount = 12000;
	$scope.totalAmount = 15000;
	$scope.amountPayable = 11900;
	$scope.walletAmount = 100;
	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	var appointmentDate = JSON.parse(localStorage.getItem('appointmentDate'));

	var timeOfAppointment = window.localStorage.getItem("chosenTime");

	console.log(timeOfAppointment,JSON.stringify(appointmentDate));


	var cartItems = JSON.parse(localStorage.getItem('BegItems'));

	// console.log("cart info",cartItems);

	var newCart = [];


	if(cartItems){
		angular.forEach(cartItems, function(value, key) {
			newCart.push(value)
		});
	}

	var appointmentDateInfo = appointmentDate.date + '/'+ appointmentDate.month + '/'+appointmentDate.year;

	console.log("appointmentDateInfo",appointmentDateInfo);


	// firebase.database().ref('bookings/'+locationInfo.cityId+'/services').key();

	// var services = [
	// {
	//     'name':'demo1',
	// 	'fabPrice':100,
	// 	'serviceId':'1001',
	// 	'customerPrice':100,
	// 	'vendorPrice':120,
	// 	'discountPrice':'10'
	// },
	// {
	// 	'name':'demo2',
	// 	'fabPrice':120,
	// 	'serviceId':'1002',
	// 	'customerPrice':120,
	// 	'vendorPrice':140,
	// 	'discountPrice':'0'
	// },
	// 	{
	// 		'name':'demo3',
	// 		'fabPrice':1200,
	// 		'serviceId':'1002',
	// 		'customerPrice':1200,
	// 		'vendorPrice':1400,
	// 		'discountPrice':'0'
	// 	}
	// ];
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
		// $scope.bookingDetail = {
		// 	'userId':localStorage.getItem('uid'),
		// 	'userName':localStorage.getItem('name'),
		// 	'userMobile':localStorage.getItem('mobileNumber'),
		// 	'cityId':locationInfo.cityId,
		// 	'vendorId':window.localStorage.getItem("vendorId"),
		// 	'totalAmount':totalVendor,
		// 	'serviceInfo':cartItems,
		// 	'createdDate':new Date().getTime(),
		// 	'appointmentDate':appointmentDateInfo,
		// 	'appointmentTime':timeOfAppointment,
		// 	'versionNumber':'1-1',
		// 	'status':'upComing',
		// 	'walletAmount':'0',
		// 	'discountPrice':'0',
		// 	'finalAmount':totalCustomer,
		// 	'walletTransId':'0',
		// 	'discountTransId':'0',
		// 	'specialRequest':'updated soon!'
		// };
	};
	$scope.calPrice = function (services) {
		var total_fabtu=0;
		var total_original=0;
		var customer_price = 0;

		angular.forEach(cartItems, function(value, key) {
			total_fabtu += value.fab_price;
			total_original += value.ven_price;
			customer_price += value.cus_price;
		});
		$scope.bookingInfo(total_fabtu,total_original,customer_price);

	};
	$scope.calPrice(cartItems);

	$scope.confirmedBooking = function(bookingDetails){
		var bookingId = firebase.database().ref('bookings/'+locationInfo.cityId+'/'+localStorage.getItem('uid')).push().key;
		bookingDetails['bookingId']=bookingId;
		firebase.database().ref('bookings/'+locationInfo.cityId+'/'+localStorage.getItem('uid')+'/'+bookingId).set(bookingDetails,function(response) {
			console.log("booking", JSON.stringify(response));
			if(response == null){
				alert('Booking confirmed!');
			}
			else{
				alert('Try again!');
			}
		})
	};
}]);

