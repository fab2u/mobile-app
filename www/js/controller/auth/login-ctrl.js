app.controller('LoginCtrl', ['$scope', 'AuthenticationService', '$ionicPopup','$ionicHistory','$state','$ionicLoading',
    function($scope, AuthenticationService, $ionicPopup,$ionicHistory,$state,$ionicLoading){

	AuthenticationService.Logout();

	$scope.user = {
      user_email: '',
      user_password: '',
    };

	$scope.loginEmail = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });
		// console.log($scope.user.user_email, $scope.user.user_password);
      // AuthenticationService.LoginEmail($scope.user.user_email, $scope.user.user_password, function(result){
      //    console.log(result);
      //    if(result === true){
      //        alert('logged in successfully!')
      //       console.log(result);
      //    }
      //    else{
      //       console.log("result = false, error in login");
            // $mdToast.show(
            //    $mdToast.simple()
            //      .textContent("Successfully Logged Out!")
            //      .hideDelay(3000)
            // );
      //    }
      // });

        firebase.auth().signInWithEmailAndPassword($scope.user.user_email, $scope.user.user_password).then(function(response){
            window.localStorage.setItem("email", response.email);
            window.localStorage.setItem("uid", response.uid);
            if(response.uid){
                if(localStorage.getItem('confirmation') == 'true'){
                    localStorage.setItem('confirmation', '');
                    $state.go('confirmation');
                }
                else{
                    $state.go('app.home');
                }
                $ionicLoading.hide();
            }
        })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
                $ionicLoading.hide();

                alert(errorMessage);

                // ...
        });
   }
	$scope.loginGmail = function(){
		console.log("gmail login button clicked");
		AuthenticationService.LoginGmail();
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
								console.log($scope.data.model);
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

}]);
