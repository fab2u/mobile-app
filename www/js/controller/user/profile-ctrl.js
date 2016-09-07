// Edit By Deepank
app.controller("profileCtrl", ['$scope', '$timeout', '$ionicLoading', function($scope, $timeout, $ionicLoading){
   $scope.uid = window.localStorage.uid;
   console.log($scope.uid);
   $scope.email = window.localStorage.email;
   // $scope.img_hash = md5($scope.uid);
   // jdenticon.update("#identicon", $scope.img_hash);

   $scope.goBack = function(){
      history.back();
   }

   $ionicLoading.show();

   firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         // User is signed in.
         console.log(user);

         db.ref("users/data/"+$scope.uid).on("value", function(snapshot){
            $ionicLoading.hide();
            console.log(snapshot.val());
            $scope.userDetails = snapshot.val();
         });


         $scope.galleryUpload = function() {

            var options = {
               destinationType : Camera.DestinationType.FILE_URI,
               sourceType :	Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
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
               sourceType :	Camera.PictureSourceType.CAMERA,
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
                  alert(uid + " " + response.Message);
                  updates1["users/data/"+uid+"/photoUrl"] = response.Message;
                  window.localStorage.setItem("userPhoto", response.Message);
                  db.ref().update(updates1).then(function(){
                     user.updateProfile({
                        photoURL: response.Message
                     }).then(function(){
                        alert("photo updated in firebase object");
                     });
                  });

               })
               .error(function(response){
                  alert(JSON.stringify(response));
               });
            }
            alert('source '+ source);
            img.src = source;
         }
      }
      else{
         $ionicLoading.hide();
         $location.path("#/login");
      }
   });
}]);
