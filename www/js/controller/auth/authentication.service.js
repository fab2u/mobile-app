app.factory("AuthenticationService", function($http, $location,$rootScope, $timeout){
   var service = {};
   service.LoginEmail = LoginEmail;
   service.LoginGmail = LoginGmail;
   service.Logout = Logout;
   service.checkAuthentication = checkAuthentication;

   return service;

   function LoginEmail(email, password, callback){
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
         db.ref().child("users").child("data").child(user.uid).on("value", function(snapshot){
            console.log(snapshot.val());
            window.localStorage.setItem("name", snapshot.val().name);
            window.localStorage.setItem("mobileNumber", snapshot.val().mobile.mobileNum);
         });
         // TODO: set path to redirect to after login
         $timeout(function(){
            $location.path('/app/home');
         }, 0);

         //TODO: error handling if gmail account is accessed through normal login.

         window.localStorage.setItem("email", email);
         window.localStorage.setItem("uid", user.uid);
         $rootScope.$broadcast('logged_in', { message: 'login successfully' });
      }).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
      });
   }

   function LoginGmail(){
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithPopup(provider).then(function(result) {
         var token = result.credential.accessToken;
         var user = result.user;
         console.log(user);
         console.log(user.uid);
         console.log(user.email);
         var ref = db.ref().child("users").orderByKey().equalTo(user.uid);
         ref.once("value", function(snapshot){
            console.log(snapshot.exists());
            if(snapshot.exists() == false){
               var newPostKey = firebase.database().ref().child('users').push().key;
               var postData = {
                  email: user.email,
                  created_date: new Date(),
                  uid: user.uid,
                  email_flag: true,
                  active_flag: true,
               };
              // Write the new post's data simultaneously in the posts list and the user's post list.
              var updates = {};
              updates['/users/' + user.uid] = postData;
              db.ref().update(updates);
            }
         });
         window.localStorage.setItem("email", user.email);
         window.localStorage.setItem("uid", user.uid);
         console.log(window.localStorage);
         $timeout(function(){
            $location.path('/app/home');
         }, 0);
      }).catch(function(error) {
         console.log(error);
         console.log("error in google signin");
      });
   }

   function Logout(){
      console.log(window.localStorage);
      if(window.localStorage.email && window.localStorage.uid){
         firebase.auth().signOut().then(function() {
            console.log('Sign-out successful.');
            delete window.localStorage.email;
            delete window.localStorage.uid;
            delete window.localStorage.name;
            // delete window.localStorage;
            console.log("Successfully deleted from localStorage");
            console.log(window.localStorage);
         }, function(error) {
            console.log("error");
         });
      }
      delete window.localStorage.email;
      delete window.localStorage.uid;
      delete window.localStorage.name;
      // $http.defaults.headers.common.uid = '';
   }

   function checkAuthentication(){
      firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            console.log("yes login");
            console.log(user);
            console.log(user.uid);
         } else {
            console.log("no login");
            $location.path("/login");
         }
      });
   }
});
