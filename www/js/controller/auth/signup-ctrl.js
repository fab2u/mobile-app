app.controller("SignupCtrl", ['$scope', '$http', function($scope, $http){

   $scope.user = {
      name: '',
      email: '',
      mobile_num: '',
      referral_code: '',
      gender: ''
   }

   $scope.signup = function(){
      var userData = {
         name: $scope.user.name,
         email: $scope.user.email,
         mobileNum: $scope.user.mobile_num,
         referralCode: $scope.user.referral_code,
         deviceId:'1234'
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
