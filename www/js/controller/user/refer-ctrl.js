app.controller('ReferCtrl', ['$scope', '$state','$cordovaSocialSharing', function($scope, $state,$cordovaSocialSharing){

	firebase.database().ref('/users/data/'+window.localStorage.getItem('uid')).once('value',function(response){
		console.log("response for referal code",response.val().myReferralCode);
		$scope.myReferralCode = response.val().myReferralCode;
	});


	$scope.showReferDetails = function(){
		$state.go('referralDetails');
	};

	// Referral code sharing over whatsApp//

	$scope.WhatsApp = function () {
		alert('whatsApp')
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
		alert('fb')
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


}]);
