app.controller('ReferCtrl',function($scope, $state,$cordovaSocialSharing,$ionicLoading,$timeout){


	$scope.show = function() {
		$ionicLoading.show();
	};
	$scope.show();
	$timeout(function () {
		$ionicLoading.hide();
	}, 5000);
	 function myReferral() {
		$ionicLoading.show();
		firebase.database().ref('/users/data/' + window.localStorage.getItem('uid')).once('value', function (response) {
			if(response.val()){
				$scope.myReferralCode = response.val().myReferralCode;
				$ionicLoading.hide();
			}
			else{
				$ionicLoading.hide();
			}
		});
	 }
    myReferral();

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
