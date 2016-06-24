app.controller("verifyEmailCtrl", ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location){

   params = window.location.href.split("&");
   console.log(params);
   var paramList = [];
   for (var i = 0; i < params.length; i++) {
      console.log(params[i].split("=").pop());
      paramList.push(params[i].split("=").pop());
   }
   console.log(paramList);
   $scope.emailid = paramList[1];

   var verifyObject = {
      id: paramList[0],
      code: paramList[1]
   };
   console.log(verifyObject);
   $http.post("http://139.162.63.158/verifyUser", verifyObject)
      .success(function(response){
         console.log(response);
         if(response.StatusCode == '200'){
            firebase.auth().createUserWithEmailAndPassword(response.email, response.password).then(function(user){
               console.log(user.uid);
               var userObject = {
                  uid: user.uid,
                  id: paramList[0]
               };
               $http.post("http://139.162.63.158/createUser", userObject)
                  .success(function(response){
                     console.log(response);
                     console.log("success");
                     alert("successfully verified");
                     window.close();
                  })
                  .error(function(response){
                     console.log("error");
                     console.log(response);
                  })
            }).catch(function(error) {
               var errorCode = error.code;
               var errorMessage = error.message;
               console.log(errorCode);
            });
         }
         else if(response.StatusCode == '400'){
            console.log("error");
            console.log(response.Message);
         }
      })
      .error(function(data){
         console.log(data);
      });
}]);
