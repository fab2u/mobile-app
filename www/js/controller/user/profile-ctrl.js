app.controller("profileCtrl",function($scope, $timeout,$location, $ionicLoading, $http,
                                      $cordovaCamera, $ionicModal){
   $scope.uid = window.localStorage.uid;
   console.log($scope.uid);
   $scope.email = window.localStorage.email;
   // $scope.img_hash = md5($scope.uid);
   // jdenticon.update("#identicon", $scope.img_hash);

   var basic;

   $scope.goBack = function(){
      history.back();
   }

   $ionicModal.fromTemplateUrl('templates/user/image-crop.html', {
      scope: $scope
   }).then(function(modal) {
      $scope.modal = modal;
   });

   $scope.testData = 'asdsdfb';

   $ionicLoading.show();

   $timeout(function () {
      $ionicLoading.hide();
   }, 10000);

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
               var image = document.getElementById('profile-pic');
               // image.src = imageURI;
               $scope.url = imageURI;
               cropImage(imageURI);
               // resizeImage(imageURI);
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
               var image = document.getElementById('profile-pic');
               image.src = imageURI;
               $scope.url = imageURI;
               // alert(JSON.stringify(imageURI)+ 'line number 283, imageURI');
               cropImage(imageURI);
               // resizeImage(imageURI);
            }, function(err) {
               console.log(err);
            });
         };

         $scope.testFunc = function(){
            $scope.modal.show();
         }

         function cropImage(source){
            $scope.modal.show();
            basic = $('.demo').croppie({
               viewport: {
                  width: 200,
                  height: 200,
                  type: 'circle'
               }
            });
            basic.croppie('bind', {
      			url: source
      		});
         }

         $scope.cropClick = function(){
            $ionicLoading.show({
               template: 'Loading! Please wait...'
            });
            basic.croppie('result', {
               type: 'canvas',
               format: 'jpeg',
               circle: true
            }).then(function (resp) {
               $ionicLoading.hide();
               // alert('test');
               // alert(JSON.stringify(resp));
               $http.post("http://139.162.3.205/api/testupload", {path: resp})
               .success(function(response){
                  // alert("success "+JSON.stringify(response));

                  var updates1 = {};
                  // alert($scope.uid + " " + response.Message);
                  updates1["/users/data/"+$scope.uid+"/photoUrl"] = response.Message;
                  window.localStorage.setItem("userPhoto", response.Message);
                  db.ref().update(updates1).then(function(){
                     // alert("updated in users obj")
                     user.updateProfile({
                        photoURL: response.Message
                     }).then(function(){
                        alert("Photo updated successfully");
                        $scope.modal.hide();
                     });
                  });

               })
               .error(function(response){
                  alert('Please try again, something went wrong');
               });
            });
         }

         function resizeImage(source){
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            img = new Image();
            // alert('img '+ img);
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
               // alert('dataURL ' + dataURL);

               $http.post("http://139.162.3.205/api/testupload", {path: dataURL})
               .success(function(response){
                  // alert("success "+JSON.stringify(response));

                  var updates1 = {};
                  // alert($scope.uid + " " + response.Message);
                  updates1["/users/data/"+$scope.uid+"/photoUrl"] = response.Message;
                  window.localStorage.setItem("userPhoto", response.Message);
                  db.ref().update(updates1).then(function(){
                     // alert("updated in users obj")
                     user.updateProfile({
                        photoURL: response.Message
                     }).then(function(){
                        alert("Photo uploaded successfully");
                     });
                  });

               })
               .error(function(response){
                  alert('Plaese try again, something went wrong!');
               });
            }
            // alert('source '+ source);
            img.src = source;
         }
      }
      else{
         $ionicLoading.hide();
         $location.path("#/login");
      }
   });
});
