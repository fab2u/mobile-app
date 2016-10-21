app.controller('ReferralDetailsCtrl', ['$scope', '$state' , '$ionicLoading',function($scope, $state,$ionicLoading){

	$scope.myReferralCode = '';
	$scope.goToRefer = function(){
		$state.go('refer');
	};

	$scope.myReferral = function() {
		$ionicLoading.show();
		firebase.database().ref('/users/data/' + window.localStorage.getItem('uid')).once('value', function (response) {
			$scope.myReferralCode = response.val().myReferralCode;
			if($scope.myReferralCode){
				firebase.database().ref('referralCode/'+$scope.myReferralCode)
					.once('value', function (response) {
						if(response.val()){
							$scope.referralDetails = response.val().referredUsers;
							$scope.referredBy = response.val().referredBy;
							$scope.referredDate = response.val().referredDate;
							if($scope.referredBy){
								firebase.database().ref('/users/data/' + $scope.referredBy).once('value', function (response) {
									$scope.referredByDetail = response.val();
									$ionicLoading.hide();
								})
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
			else{
				$ionicLoading.hide();
			}
		});
	};
	$scope.myReferral();




}])