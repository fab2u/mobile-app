app.controller("profileCtrl",function($scope, $timeout,$state, $ionicLoading, $http,
                                      $cordovaCamera,userServices, $ionicModal,$cordovaToast){
   $scope.uid = window.localStorage.uid;
   var basic;

   $timeout(function () {
      $ionicLoading.hide();
   }, 10000);

   if($scope.uid){
      getUserDetail();
      function getUserDetail() {
         $ionicLoading.show();
         userServices.getUserInfo($scope.uid).then(function (result) {
            $ionicLoading.hide();
            if(result){
               $scope.userDetails = result;
            }
            else{
               $scope.userDetails = '';
            }
         })
      }

      $ionicModal.fromTemplateUrl('templates/user/image-crop.html', {
         scope: $scope
      }).then(function(modal) {
         $scope.modal = modal;
      });

      $scope.cameraUpload = function() {
         $timeout(function () {
            $ionicLoading.show();
         }, 2000);
         var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType :	Camera.PictureSourceType.CAMERA,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
         };
         $ionicLoading.hide();

         $cordovaCamera.getPicture(options).then(function(imageURI) {
            var image = document.getElementById('profile-pic');
            image.src = imageURI;
            $scope.url = imageURI;
            // alert(JSON.stringify(imageURI)+ 'line number 283, imageURI');
            if($scope.url){
               cropImage($scope.url);
            }
            // resizeImage(imageURI);
         }, function(err) {
            console.log(err);
         });
      };

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

      $scope.testFunc = function(){
         $scope.modal.show();
      }

      $scope.cropClick = function() {
         $timeout(function () {
            $ionicLoading.show({
               template: 'Loading! Please wait...'
            });
         }, 4000);

         basic.croppie('result', {
            type: 'canvas',
            format: 'jpeg',
            circle: true
         }).then(function (resp) {
            // alert('test');
            // alert(JSON.stringify(resp));
            $http.post("http://139.162.3.205/api/testupload", {path: resp})
                .success(function (response) {
                   $ionicLoading.hide();

                   // alert("success  uploaded on server"+JSON.stringify(response));

                   var updates1 = {};
                   // alert($scope.uid + " " + response.Message);
                   updates1["/users/data/" + $scope.uid + "/photoUrl"] = response.Message;
                   window.localStorage.setItem("userPhoto", response.Message);
                   db.ref().update(updates1).then(function () {
                      // alert("updated in users obj")
                      user.updateProfile({
                         photoURL: response.Message
                      }).then(function () {
                         $cordovaToast
                             .show('Photo updated successfully', 'long', 'center')
                             .then(function (success) {
                                // success
                             }, function (error) {
                                // error
                             });
                         $scope.modal.hide();
                      });
                   });

                })
                .error(function (response) {
                   $ionicLoading.hide();
                   $cordovaToast
                       .show('Please try again, something went wrong', 'long', 'center')
                       .then(function (success) {
                          // success
                       }, function (error) {
                          // error
                       });
                });
         })
      };
      $scope.galleryUpload = function() {
         $timeout(function () {
            $ionicLoading.show();
         }, 2000);
         var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType :	Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
         };
         $ionicLoading.hide();
         $cordovaCamera.getPicture(options).then(function(imageURI) {
            var image = document.getElementById('profile-pic');
            // image.src = imageURI;
            $scope.url = imageURI;
            if($scope.url) {
               cropImage($scope.url);
            }
            // resizeImage(imageURI);
         }, function(err) {
            console.log(err);
         });
      };

      $scope.goBack = function(){
         history.back();
      };

   }
   else{
      $state.go('login')
   }
});
