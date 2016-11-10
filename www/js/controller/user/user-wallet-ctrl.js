app.controller('UserWalletCtrl',function($scope,$state,$ionicLoading,$timeout){

	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.amount = 0;
	$scope.walletHistory = [];
	// To get user wallet information for wallet money and transactions

	function getWalletInfo() {
		$ionicLoading.show();
		firebase.database().ref('userWallet/' + localStorage.getItem('uid')).once('value', function(response) {
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
				$ionicLoading.hide();
			}
			else {
				$scope.msg = 'No history found';
				$ionicLoading.hide();
			}
		})
	}
	getWalletInfo();

	$scope.go_home = function () {
		$state.go('app.home')
	};
	$scope.myReferral = function () {
		$state.go('refer');
	};

});