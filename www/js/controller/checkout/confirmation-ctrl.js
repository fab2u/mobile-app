app.controller('ConfirmationCtrl', ['$scope', function($scope){
	
	$scope.paidFromWallet = 100;
	$scope.discountedAmount = 12000;
	$scope.totalAmount = 15000;
	$scope.amountPayable = 11900;
	$scope.walletAmount = 100;
	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	// firebase.database().ref('bookings/'+locationInfo.cityId+'/services').key();

	var services = [
	{
	    'name':'demo1',
		'fabPrice':100,
		'serviceId':'1001',
		'customerPrice':100,
		'vendorPrice':120,
		'discountPrice':'10'
	},
	{
		'name':'demo2',
		'fabPrice':120,
		'serviceId':'1002',
		'customerPrice':120,
		'vendorPrice':140,
		'discountPrice':'0'
	},
		{
			'name':'demo3',
			'fabPrice':1200,
			'serviceId':'1002',
			'customerPrice':1200,
			'vendorPrice':1400,
			'discountPrice':'0'
		}
	];
	$scope.bookingInfo =function (totalFab,totalVendor,totalCustomer) {
		$scope.bookingDetail = {
			'userId':localStorage.getItem('uid'),
			'userName':localStorage.getItem('name'),
			'userMobile':localStorage.getItem('mobileNumber'),
			'cityId':locationInfo.cityId,
			'vendorId':'-KPmj7NTUSz0kW3H10MJ',
			'totalAmount':totalVendor,
			'serviceInfo':services,
			'createdDate':new Date().getTime(),
			'appointmentDate':'04/09/2016',
			'versionNumber':'1-1',
			'status':'upComing',
			'walletAmount':'0',
			'finalAmount':totalCustomer,
			'walletTransId':'0',
			'discountTransId':'0',
			'specialRequest':'updated soon!'
		};
	};
	$scope.calPrice = function (services) {
		var total_fabtu=0;
		var total_original=0;
		var customer_price = 0;
		angular.forEach(services, function(value, key) {
			total_fabtu += value.fabPrice;
			total_original += value.vendorPrice;
			customer_price += value.customerPrice;
		});
		$scope.bookingInfo(total_fabtu,total_original,customer_price);

	};
	$scope.calPrice(services);



	$scope.confirmedBooking = function(bookingDetails){
		firebase.database().ref('bookings/'+locationInfo.cityId).push(bookingDetails,function(response) {
			console.log("booking", JSON.stringify(response));
			if(response == null){
				alert('Booking confirmed!');
			}
			else{
				alert('Try again!');
			}
		})
	}

}]);

