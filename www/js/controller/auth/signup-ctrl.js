app.controller("SignupCtrl", ['$scope', '$http', '$state','$cordovaDevice',function($scope, $http,$state,$cordovaDevice){

   $scope.user = {
      name: '',
      email: '',
      mobile_num: '',
      referral_code: '',
      gender: ''
   };

   $scope.loginPage = function(){
       $state.go('login');
   }

    // deviceInformation/Registered
    firebase.database().ref('deviceInformation/Registered').once('value',function(response){
        $scope.device_list = response.val();
        console.log("response for device_list",JSON.stringify(response.val()));
    });

    $scope.signup = function(){
        var userData = {
         name: $scope.user.name,
         email: $scope.user.email,
         mobileNum: $scope.user.mobile_num,
         referralCode: $scope.user.referral_code,
         deviceId: $cordovaDevice.getDevice().uuid
      }
      $http.post("http://139.162.27.64/api/addUser", userData)
         .success(function(response){
            if(response.StatusCode == 200){
               alert(response.Message);
            }
            else if(response.StatusCode == 400){
                alert(response.Message);
            }
            else{
               alert('some thing went wrong!');
            }
            console.log(response);
         })
         .error(function(response){
            console.log("error");
            console.log(response);
         });
   }
}]);
