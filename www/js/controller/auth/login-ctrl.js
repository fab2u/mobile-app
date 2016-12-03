app.controller('LoginCtrl',function($scope,$ionicHistory,$state, AuthenticationService, $ionicPopup){
	AuthenticationService.Logout();
	$scope.user = {
      user_email: '',
      user_password: ''
    };
    $scope.back = function () {
        // if(localStorage.getItem('confirmation') == 'true'){
        //     localStorage.setItem('confirmation', '');
        //     $state.go('confirmation');
        // }
        // else{
        //     $state.go('app.home')
        // }
        console.log("else",$ionicHistory.viewHistory().histories.root)
        if($ionicHistory.backView()){
            if($ionicHistory.backView().stateName == 'signup'){
                if($ionicHistory){
                    if($ionicHistory.viewHistory()){
                        if($ionicHistory.viewHistory().histories){
                            if($ionicHistory.viewHistory().histories.root){
                                if($ionicHistory.viewHistory().histories.root.stack[0]){
                                    $state.go($ionicHistory.viewHistory().histories.root.stack[0].stateName)
                                }
                                else{
                                    $state.go('app.home')
                                }
                            }
                            else{
                                $state.go('app.home')
                            }
                        }
                        else{
                            $state.go('app.home')
                        }
                    }
                    else{
                        $state.go('app.home')
                    }
                }
                else{
                    $state.go('app.home')
                }

            }
            else{
                $state.go('app.home')
            }
        }
        else{
            if($ionicHistory){
                if($ionicHistory.viewHistory()){
                    if($ionicHistory.viewHistory().histories){
                        if($ionicHistory.viewHistory().histories.root){
                            if($ionicHistory.viewHistory().histories.root.stack[1]){
                                $state.go($ionicHistory.viewHistory().histories.root.stack[1].stateName)
                            }
                            else{
                                $state.go('app.home')
                            }
                        }
                        else{
                            $state.go('app.home')
                        }
                    }
                    else{
                        $state.go('app.home')
                    }
                }
                else{
                    $state.go('app.home')
                }
            }
            else{
                $state.go('app.home')
            }

        }

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
