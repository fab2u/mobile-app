app.directive('expandingTextarea', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs, $timeout) {
            $element.css('min-height', '0');
            $element.css('resize', 'none');
            $element.css('overflow-y', 'hidden');
            setHeight(0);
            $timeout(setHeightToScrollHeight);

            function setHeight(height) {
                $element.css('height', height + 'px');
                $element.css('max-height', height + 'px');
            }

            function setHeightToScrollHeight() {
                setHeight(0);
                var scrollHeight = angular.element($element)[0]
                  .scrollHeight;
                if (scrollHeight !== undefined) {
                    setHeight(scrollHeight);
                }
            }

            $scope.$watch(function () {
                return angular.element($element)[0].value;
            }, setHeightToScrollHeight);
        }
    };
});

app.controller("newFeedCtrl",function($scope, $http, $location, $timeout,
                                      $cordovaCamera, $ionicLoading){
   $ionicLoading.show();

   var uid = localStorage.getItem("uid");
   db.ref("users/data/"+uid+"/name").once("value", function(snapshot){
		console.log(snapshot.val());
		$scope.uname = snapshot.val();
		$ionicLoading.hide();
	});
   var blogData;

   var locDetails = JSON.parse(localStorage.getItem('selectedLocation'));

   $scope.goBack = function(){
		history.back();
   };

   $scope.feed = {};

   $scope.submitFeed = function(){
       if(uid){
           if(!$scope.feed.introduction && !$scope.image_url){
               alert('Please add an image and description.');
           }
           else if($scope.feed.introduction && !$scope.image_url){
               alert('Please add an image')

           }
           else if(!$scope.feed.introduction && $scope.image_url){
               alert('Please add description.')

           }
           else if($scope.feed.introduction && $scope.image_url){
               if($scope.feed.introduction.substring(0, 1) == '#'){
                   var newBlogKey = db.ref().child("blogs").push().key;
                   blogData = {
                       blog_id: newBlogKey,
                       // title: $scope.feed.title,
                       introduction: $scope.feed.introduction,
                       user: {
                           user_name: $scope.uname,
                           user_id: localStorage.getItem("uid"),
                           user_email: localStorage.getItem("email")
                       },
                       active: true,
                       created_time: new Date().getTime(),
                       city_id: locDetails.cityId,
                       city_name: locDetails.cityName
                   };
                   // alert($scope.image_url)
                   // blogData['photoUrl'] = $scope.image_url;
                   if ($scope.image_url != undefined){
                       // alert('inside if');
                       blogData['photoUrl'] = $scope.image_url;
                   }
                   // alert(blogData.photoUrl)

                   var re = /#(\w+)(?!\w)/g, hashTag, tagsValue = [];
                   while (hashTag = re.exec($scope.feed.introduction)) {
                       tagsValue.push(hashTag[1]);
                   }
                   console.log(tagsValue);
                   // blog object update without tags, functional
                   var updateBlog = {};
                   updateBlog['/blogs/' + newBlogKey] = blogData;
                   updateBlog['/cityBlogs/'+blogData.city_id+"/blogs/"+newBlogKey] = true;
                   console.log(updateBlog);
                   db.ref().update(updateBlog);
                   // alert('2');
                   for(var i=0; i<tagsValue.length; i++){
                       //tags object update, functional
                       var tagsData = db.ref().child("tags").child(tagsValue[i]);
                       console.log(tagsData);
                       var tag_blog =  tagsData.child("blogs");
                       var obj = {};
                       obj[newBlogKey] = true;
                       console.log(obj);
                       tag_blog.update(obj);

                       var updates = {};
                       updates['/blogs/'+newBlogKey+'/tags/' + tagsValue[i]] = true;
                       console.log(updates);
                       db.ref().update(updates);
                   }
                   // user object update, functional
                   var authUpdate = {};
                   authUpdate['/users/data/'+ blogData.user.user_id+ '/blogs/' + newBlogKey] = true;
                   console.log(authUpdate);
                   // alert('4');
                   db.ref().update(authUpdate).then(function(){
                       $timeout(function () {
                           $location.path("/feed");
                       }, 0);
                   });
               }
               else{
                   alert('Please add # in your description.')
               }
           }
       }
       else{
           alert('Please login/SignUp for create post.')
       }
   };

   $scope.galleryUpload = function() {
       $timeout(function () {
           $ionicLoading.show();
       }, 2000);
       var options = {
         destinationType : Camera.DestinationType.FILE_URI,
         sourceType :   Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
         allowEdit : false,
         encodingType: Camera.EncodingType.JPEG,
         popoverOptions: CameraPopoverOptions,
      };
       $ionicLoading.hide();
      $cordovaCamera.getPicture(options).then(function(imageURI) {
         var image = document.getElementById('myImage');
         image.src = imageURI;
         $scope.url = imageURI;
          if(imageURI){
              resizeImage(imageURI);
          }
      }, function(err) {
         console.log(err);
      });
   };

   $scope.cameraUpload = function() {
       $timeout(function () {
           $ionicLoading.show();
       }, 2000);
      var options = {
         destinationType : Camera.DestinationType.FILE_URI,
         sourceType :   Camera.PictureSourceType.CAMERA,
         allowEdit : false,
         encodingType: Camera.EncodingType.JPEG,
         popoverOptions: CameraPopoverOptions,
      };
       $ionicLoading.hide();

      $cordovaCamera.getPicture(options).then(function(imageURI) {
         var image = document.getElementById('myImage');
         image.src = imageURI;
         $scope.url = imageURI;
          if(imageURI){
              resizeImage(imageURI);
          }
      }, function(err) {
         console.log(err);
      });
   };

   function resizeImage(source){
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      img = new Image();
      img.onload = function () {
         // alert("onload called javascript");
         canvas.width = img.width;
         canvas.height = img.height;
         var ctx = canvas.getContext("2d");
         ctx.drawImage(img, 0, 0);
         // alert(canvas.width+" "+canvas.height+" "+img.width+" "+img.height);
         var dataURL = canvas.toDataURL("image/jpeg");

         $http.post("http://139.162.3.205/api/testupload", {path: dataURL})
         .success(function(response){
            // alert('success: ' + response);
            $scope.image_url = response.Message;
            $(".upload").css("display", 'none');

         })
         .error(function(response){
            alert("error: " + response);
         });
      }
      img.src = source;
      $(".upload").css("display", 'none');
   }
});
