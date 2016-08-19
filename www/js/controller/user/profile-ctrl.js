// Edit By Deepank
// app.controller("profileCtrl", ['$scope', '$timeout', function($scope, $timeout){
//    $scope.uid = window.localStorage.uid;
//    console.log($scope.uid);
//    $scope.email = window.localStorage.email;
//    $scope.img_hash = md5($scope.uid);
//    jdenticon.update("#identicon", $scope.img_hash);
//
//    $scope.goBack = function(){
// 		history.back();
// 	}
//
//    var ref = db.ref("users/data/"+$scope.uid);
//    console.log(ref);
//    ref.on("value", function(snapshot){
//       console.log(snapshot.val());
//       $scope.userDetails = snapshot.val();
//    });
// }]);

app.controller("profileCtrl", ['$scope', '$timeout', '$ionicLoading', '$cordovaCamera', '$http', '$ionicPopup','$location',
   function($scope, $timeout, $ionicLoading, $cordovaCamera, $http, $ionicPopup,$location){
   $ionicLoading.show({
      template: 'Loading...'
   });

   $scope.myGoBack = function(){
      history.back();
   }

   $timeout(function () {
      $ionicLoading.hide();
   }, 10000);


   var uid = window.localStorage.uid;

   firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         // User is signed in.
         console.log(user);
         $scope.uid = window.localStorage.userUid;
         console.log($scope.uid);
         // $scope.email = window.localStorage.email;
         var ref = db.ref("users/data/"+$scope.uid);
         console.log(ref);
         ref.on("value", function(snapshot){
            if(snapshot.val().mobile.mobileFlag == false){
               $scope.showMobileVerify = true;
            } else {
               $scope.showMobileVerify = false;
               $scope.showOTPfield = false;
            }
            $timeout(function () {
               $scope.val = snapshot.val();
               console.log(snapshot.val().photoUrl);
               if(snapshot.val().photoUrl){
                  $(".profile-pic").css("display", 'none');
                  document.getElementById("myImage").src = snapshot.val().photoUrl;
               }
               else{
                  $scope.img_hash = md5($scope.uid);
                  jdenticon.update("#identicon", $scope.img_hash);
               }
               $ionicLoading.hide();
            }, 0);
         });

         $scope.galleryUpload = function() {

            var options = {
               destinationType : Camera.DestinationType.FILE_URI,
               sourceType : Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
               allowEdit : false,
               encodingType: Camera.EncodingType.JPEG,
               popoverOptions: CameraPopoverOptions,
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
               var image = document.getElementById('myImage');
               image.src = imageURI;
               $scope.url = imageURI;

               resizeImage(imageURI);

            }, function(err) {
               console.log(err);
            });
         };

         $scope.cameraUpload = function() {

            var options = {
               destinationType : Camera.DestinationType.FILE_URI,
               sourceType : Camera.PictureSourceType.CAMERA,
               allowEdit : false,
               encodingType: Camera.EncodingType.JPEG,
               popoverOptions: CameraPopoverOptions,
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
               var image = document.getElementById('myImage');
               image.src = imageURI;
               $scope.url = imageURI;
               alert(JSON.stringify(imageURI)+ 'line number 283, imageURI');

               resizeImage(imageURI);

            }, function(err) {
               console.log(err);
            });
         };

         function resizeImage(source){
            alert('resizeImage called')
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            img = new Image();
            alert('img '+ img);
            img.onload = function () {
               // alert("onload called javascript");
               canvas.height = canvas.width * (img.height / img.width);
               /// step 1
               var oc = document.createElement('canvas');
               var octx = oc.getContext('2d');
               oc.width = img.width * 0.5;
               oc.height = img.height * 0.5;
               octx.drawImage(img, 0, 0, oc.width, oc.height);
               /// step 2
               octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
               ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, canvas.width, canvas.height);
               // alert(canvas.width+" "+canvas.height+" "+img.width+" "+img.height);
               var dataURL = canvas.toDataURL("image/jpeg");
               alert('dataURL ' + dataURL);

               $http.post("http://139.162.3.205/api/testupload", {path: dataURL})
                   .success(function(response){
                      alert("success "+JSON.stringify(response));

                      var updates1 = {};
                      alert($scope.uid + " " + response.Message);
                      updates1["users/data/"+$scope.uid+"/photoUrl"] = response.Message;
                      db.ref().update(updates1).then(function(){
                         user.updateProfile({
                            photoURL: response.Message
                         }).then(function(){
                            alert("photo updated in firebase object");
                            $(".profile-pic").css("display", 'none');
                         });
                      });

                   })
                   .error(function(response){
                      alert(JSON.stringify(response));
                      $("#myImage").css("display", 'none');
                   });
            }
            alert('source '+ source);
            img.src = source;
            $(".profile-pic").css("display", 'none');
         }

      } else {
         $location.path("#/login");
      }
   });




}]);
