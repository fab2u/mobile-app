app.controller('ReferralDetailsCtrl',function($scope,$timeout,$state,$ionicLoading){

	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.goToRefer = function(){
		$state.go('refer');
	};

	function myReferral() {
		$ionicLoading.show();
		firebase.database().ref('/users/data/' + window.localStorage.getItem('uid')).once('value', function (response) {
			if(response.val()){
				$scope.myReferralCode = response.val().myReferralCode;
				myReferralHistory()
			}
			else{
				$ionicLoading.hide();
			}
		});
	};
    myReferral();

	function myReferralHistory(){
		firebase.database().ref('referralCode/'+$scope.myReferralCode)
			.once('value', function (response) {
				if(response.val()){
					$scope.referralDetails = response.val().referredUsers;
					$scope.referredBy = response.val().referredBy;
					$scope.referredDate = response.val().referredDate;
					if($scope.referredBy){
						referredByInfo()
					}
					else{
						$scope.msg = 'Referred by none!';
						$ionicLoading.hide();
					}
				}
				else{
					$scope.msg1 = 'Sorry,no history found yet!';
					$ionicLoading.hide();
				}
			})
	}

	function referredByInfo() {
		firebase.database().ref('/users/data/' + $scope.referredBy).once('value', function (response) {
			$scope.referredByDetail = response.val();
			$ionicLoading.hide();
		})
	}





	$scope.referNearn = function () {
		$state.go('refer');
	};
})