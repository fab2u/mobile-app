app.controller('UserWalletCtrl',function($scope,$state,$ionicLoading){

	$scope.amount = 0;
	$scope.walletHistory = [];
	// To get user wallet information for wallet money and transactions

	$scope.getWalletInfo = function () {
		$ionicLoading.show();
		// firebase.database().ref('userWallet/data/' + localStorage.getItem('uid')).once('value', function (response) {
		// 	$scope.userWalletInfo = response.val();
        //
		// 	console.log("user wallet info",JSON.stringify($scope.userWalletInfo))
        //
		// 	if($scope.userWalletInfo){
		// 		$ionicLoading.hide();
		// 	}
		// 	else{
		// 		$ionicLoading.hide();
		// 	}
		// })

		firebase.database().ref('userWallet/data/' + localStorage.getItem('uid')).once('value', function(response) {
			$scope.userWalletInfo = response.val().debit;

			console.log(JSON.stringify(response.val()));
			var debitAmount = 0;
			var creditAmount = 0;
			if(response.val()){
				if(response.val().debit){
					angular.forEach(response.val().debit, function(value, key){
						$scope.walletHistory.push(value);
						debitAmount = debitAmount+ value.amount;
					})
				}
				if(response.val().credit){
					angular.forEach(response.val().credit, function(value, key){
						$scope.walletHistory.push(value);
						creditAmount = creditAmount+ value.amount;
					})
				}
				$scope.amount = creditAmount - debitAmount;
				if($scope.amount > 0){
					$ionicLoading.hide();

					$scope.hasWalletBalance = true;
				} else {
					$ionicLoading.hide();
				}
			} else {
				$ionicLoading.hide();
			}
		})
	};
	$scope.getWalletInfo();

	console.log('user wallet',$scope.walletHistory);

	$scope.transactions = [
		{name: 'Arpit Mittal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Puni Charana', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Aadharsh Nair', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Anu Porwal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Ritesh Khorana', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Yoshita Arora', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Nishtha Agarwal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Payal Patel', id: 'AB23CD', date: '14th Jan 2016', amount: '200'}
	];

	$scope.go_home = function () {
		$state.go('app.home')
	};

});