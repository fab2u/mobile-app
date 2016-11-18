app.factory("AuthenticationService", function($http, $location,$rootScope,$state,$cordovaToast,
                                              $ionicLoading,$timeout){
   var service = {};
   service.LoginEmail = LoginEmail;
   service.Logout = Logout;
   service.checkAuthentication = checkAuthentication;
   return service;

   $timeout(function () {
      $ionicLoading.hide();
   }, 2000);

   function LoginEmail(email,password) {
      $ionicLoading.show();
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
         db.ref().child("users").child("data").child(user.uid).on("value", function (snapshot) {
            console.log(snapshot.val());
            window.localStorage.setItem("name", snapshot.val().name);
            window.localStorage.setItem("mobileNumber", snapshot.val().mobile.mobileNum);
            window.localStorage.setItem("email", email);
            window.localStorage.setItem("uid", user.uid);
            if(localStorage.getItem('confirmation') == 'true'){
               localStorage.setItem('confirmation', '');
               $cordovaToast
                   .show('Logged in successfully!', 'long', 'center')
                   .then(function(success) {
                      // success
                   }, function (error) {
                      // error
                   });
               $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
               $ionicLoading.hide();
               $state.go('confirmation');
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
               $state.go('app.home');
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
            console.log('Sign-out successful.');
            delete window.localStorage.email;
            delete window.localStorage.uid;
            delete window.localStorage.name;
            delete window.localStorage.allBookingInfo;
            delete window.localStorage.mobileNumber;
            delete window.localStorage.mobile_verify;
            console.log("Successfully deleted from localStorage");
            console.log(window.localStorage);
         }, function(error) {
            console.log("error");
         });
      }
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
