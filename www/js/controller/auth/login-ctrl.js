app.controller('LoginCtrl',function($scope, AuthenticationService, $ionicPopup){
	AuthenticationService.Logout();
	$scope.user = {
      user_email: '',
      user_password: ''
    };
    $scope.back = function () {
        history.back();
    };

	$scope.loginEmail = function(){
        AuthenticationService.LoginEmail($scope.user.user_email, $scope.user.user_password);
   };

	$scope.showPopup = function() {
      $scope.data = {}
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" ng-model = "data.model">',
         title: 'Reset Password',
         subTitle: 'Enter your email address',
         scope: $scope,

         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Send Link</b>',
               type: 'pinkcolor',
                  onTap: function(e) {
                     if (!$scope.data.model) {
                        //don't allow the user to close unless he enters model...
                           e.preventDefault();
                     } else {
							  var auth = firebase.auth();
						      var emailAddress = $scope.data.model;
						      auth.sendPasswordResetEmail(emailAddress).then(function() {
									sentPopup();
						      }, function(error) {
						         console.log(error);
						      });
                        return $scope.data.model;
                     }
                  }
            }
         ]
      });
   };

	function sentPopup(){
		$ionicPopup.alert({
       title: 'Reset Link sent to your email address!',
      //  template: 'It might taste good'
     });
   };

});
