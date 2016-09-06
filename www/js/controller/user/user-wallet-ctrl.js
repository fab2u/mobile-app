app.controller('UserWalletCtrl',function($scope,$state,$ionicLoading){

	// To get user wallet information for wallet money and transactions

	$scope.getWalletInfo = function () {
		$ionicLoading.show({
			template: 'Loading...'
		})
		firebase.database().ref('userWallet/data/' + localStorage.getItem('uid')).once('value', function (response) {
			$scope.userWalletInfo = response.val();

			if($scope.userWalletInfo){
				$ionicLoading.hide();
			}
			else{
				$ionicLoading.hide();
			}
		})
	};
	$scope.getWalletInfo();

	console.log('user wallet');

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