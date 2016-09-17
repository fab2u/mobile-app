app.controller('ReferCtrl',function($scope, $state,$cordovaSocialSharing,$ionicLoading){

	$scope.myReferral = function() {
		$ionicLoading.show();
		firebase.database().ref('/users/data/' + window.localStorage.getItem('uid')).once('value', function (response) {
			console.log("response for referal code", response.val().myReferralCode);
			$scope.myReferralCode = response.val().myReferralCode;
			$ionicLoading.hide();
		});
	};
	$scope.myReferral();

	$scope.showReferDetails = function(){
		$state.go('referralDetails');
	};

	// Referral code sharing over whatsApp//

	$scope.WhatsApp = function () {
		$cordovaSocialSharing
			.shareViaWhatsApp('Download the shopping app and use my referral code'+$scope.myReferralCode, '', '')
			.then(function (result) {
				// Success!
			}, function (err) {
				// An error occurred. Show a message to the user
			});
	};

	// Referral code sharing over Facebook//

	$scope.Facebook = function () {
		$cordovaSocialSharing
			.shareViaFacebook('Download the shopping app and use my referral code'+$scope.myReferralCode, '', '')
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
