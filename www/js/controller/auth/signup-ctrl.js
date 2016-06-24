app.controller("SignupCtrl", ['$scope', '$http', function($scope, $http){

   $scope.user = {
      name: '',
      email: '',
      mobile_num: '',
      password: '',
      referral_code: '',
      gender: ''
   }

   $scope.signup = function(){
      var userData = {
         name: $scope.user.name,
         email: $scope.user.email,
         mobile_num: $scope.user.mobile_num,
         password: $scope.user.password,
         referral_code: $scope.user.referral_code,
         gender: $scope.user.gender
      }
      console.log(userData);
      $http.post("http://139.162.63.158/addNewUser", userData)
         .success(function(response){
            console.log("success");
            console.log(response);
         })
         .error(function(response){
            console.log("error");
            console.log(response);
         });
   }
}]);
