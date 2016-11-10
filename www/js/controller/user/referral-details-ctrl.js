app.controller('ReferralDetailsCtrl',function($scope,$timeout,$state,$ionicLoading){

	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.myReferralCode = '';
	$scope.goToRefer = function(){
		$state.go('refer');
	};

	function referredByInfo(referredBy) {
		firebase.database().ref('/users/data/' + referredBy).once('value', function (response) {
			$scope.referredByDetail = response.val();
			$ionicLoading.hide();
		})
	}

	function myReferralHistory(myReferralCode){
		firebase.database().ref('referralCode/'+myReferralCode)
			.once('value', function (response) {
				if(response.val()){
					$scope.referralDetails = response.val().referredUsers;
					$scope.referredBy = response.val().referredBy;
					$scope.referredDate = response.val().referredDate;
					if($scope.referredBy){
						referredByInfo($scope.referredBy)
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

	$scope.myReferral = function() {
		$ionicLoading.show();
		firebase.database().ref('/users/data/' + window.localStorage.getItem('uid')).once('value', function (response) {
			if(response.val()){
				$scope.myReferralCode = response.val().myReferralCode;
				myReferralHistory($scope.myReferralCode)
			}
			else{
				$ionicLoading.hide();
			}
		});
	};
	$scope.myReferral();

	$scope.referNearn = function () {
		$state.go('refer');
	};
})