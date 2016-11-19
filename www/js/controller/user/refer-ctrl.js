app.controller('ReferCtrl',function($scope,referService,$state,$cordovaSocialSharing,
									$ionicLoading,$timeout,$cordovaToast){

    var uId = window.localStorage.getItem('uid');
	$timeout(function () {
		$ionicLoading.hide();
	}, 5000);
	if(uId){
		myReferral();
	}
	else{
		$cordovaToast
			.show('Please login/SignUp first!', 'long', 'center')
			.then(function(success) {
				// success
			}, function (error) {
				// error
			});
	}
	 function myReferral() {
		$ionicLoading.show();
		 referService.getReferralCode(uId).then(function (result) {
			 if(result){
				 $scope.myReferralCode = result.myReferralCode;
				 $ionicLoading.hide();
			 }
			 else{
				 $scope.myReferralCode = '';
				 $ionicLoading.hide();
			 }
		 })
	 }

	$scope.showReferDetails = function(){
		$state.go('referralDetails');
	};

	// Referral code sharing over whatsApp//

	$scope.WhatsApp = function () {
		$cordovaSocialSharing
			.shareViaWhatsApp('Download the Fab2u app and use my referral code  '+$scope.myReferralCode +'and get RS. 25 in wallet', '', 'https://play.google.com/store/apps/details?id=com.ionicframework.fab2u641617')
			.then(function (result) {
				// Success!
			}, function (err) {
			});
	};

	// Referral code sharing over Facebook//

	$scope.Facebook = function () {
		$cordovaSocialSharing
			.shareViaFacebook('Download the Fab2u app and use my referral code  '+$scope.myReferralCode +'and get RS. 25 in wallet', '', 'https://play.google.com/store/apps/details?id=com.ionicframework.fab2u641617')
			.then(function (result) {
				// Success!
			}, function (err) {
				// An error occurred. Show a message to the user
			});
	};

	$scope.go_home = function () {
		$state.go('app.home')
	};
	
});
