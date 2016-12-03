app.factory("AuthenticationService", function($http, $location,$rootScope,$state,$cordovaToast,
                                              $ionicLoading,$timeout,$ionicHistory){
   var service = {};
   service.LoginEmail = LoginEmail;
   service.Logout = Logout;
   service.checkAuthentication = checkAuthentication;
   return service;

   $timeout(function () {
      $ionicLoading.hide();
   }, 5000);

   function LoginEmail(email,password) {
      $ionicLoading.show();
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
         db.ref().child("users").child("data").child(user.uid).on("value", function (snapshot) {
            if(snapshot.val()){
               window.localStorage.setItem("name", snapshot.val().name);
               window.localStorage.setItem("mobileNumber", snapshot.val().mobile.mobileNum);
               window.localStorage.setItem("email", email);
               window.localStorage.setItem("uid", user.uid);
               if($ionicHistory.backView()){
                  if($ionicHistory.backView().stateName == 'signup'){
                     $cordovaToast
                         .show('Logged in successfully!', 'long', 'center')
                         .then(function(success) {
                            // success
                         }, function (error) {
                            // error
                         });
                     $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
                     $ionicLoading.hide();
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
                     $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
                     // $cordovaToast
                     //     .show('Logged in successfully!', 'long', 'center')
                     //     .then(function(success) {
                     //        // success
                     //     }, function (error) {
                     //        // error
                     //     });
                     $ionicLoading.hide();
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
               }
               else{
                  $state.go('app.home');
                  $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
                  $ionicLoading.hide();
                  $cordovaToast
                      .show('User not found. Please signup to continue.', 'long', 'center')
                      .then(function(success) {
                         // success
                      }, function (error) {
                         // error
                      });
               }

            }
            else{
               $ionicLoading.hide();
               $cordovaToast
                   .show('User not found. Please signup to continue.', 'long', 'center')
                   .then(function(success) {
                      // success
                   }, function (error) {
                      // error
                   });
            }

         });
      }).catch(function(error) {
         $ionicLoading.hide();
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         if(errorCode === 'auth/invalid-email'){
            $cordovaToast
                .show('You entered wrong email address!', 'long', 'center')
                .then(function(success) {
                   // success
                }, function (error) {
                   // error
                });
         }
         else if(errorCode === 'auth/user-disabled'){
            $cordovaToast
                .show('Your access is temporary denied!', 'long', 'center')
                .then(function(success) {
                   // success
                }, function (error) {
                   // error
                });
         }
         else if(errorCode === 'auth/user-not-found'){
            $cordovaToast
                .show('Sorry,currently you are not registered with us!', 'long', 'center')
                .then(function(success) {
                   // success
                }, function (error) {
                   // error
                });
         }
         else if(errorCode === 'auth/wrong-password'){
            $cordovaToast
                .show('You entered wrong password!', 'long', 'center')
                .then(function(success) {
                   // success
                }, function (error) {
                   // error
                });
         }
      });

   }


   function Logout(){
      if(window.localStorage.email && window.localStorage.uid){
         firebase.auth().signOut().then(function() {
            clearUnUsedLocalStorage();
            console.log("Successfully deleted from localStorage");
            console.log(window.localStorage);
         }, function(error) {
            console.log("error");
         });
      }
   }
   function clearUnUsedLocalStorage() {
      delete window.localStorage.email;
      delete window.localStorage.uid;
      delete window.localStorage.name;
      delete window.localStorage.allBookingInfo;
      delete window.localStorage.mobileNumber;
      delete window.localStorage.mobile_verify;
      delete window.localStorage.slectedItems;
      delete window.localStorage.catItems;
      delete window.localStorage.serviceId;
      delete window.localStorage.chosenTime;
      delete window.localStorage.vendorName;
      delete window.localStorage.vendorMobile;
      delete window.localStorage.vendorLandmark;
      delete window.localStorage.vendorLandline;
      delete window.localStorage.vendorId;
      delete window.localStorage.slectedItem;
      delete window.localStorage.BegItems;
      delete window.localStorage.previousOtp;
      delete window.localStorage.pageName;
      delete window.localStorage.selectedTab;
      delete window.localStorage.currentBookingId;
      delete window.localStorage.mapStorage;
      delete window.localStorage.VendorServiceListIds;
   }

   function checkAuthentication(){
      firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            console.log(user.uid);
         } else {
            $location.path("/login");
         }
      });
   };
});
