app.controller("newFeedCtrl", ['$scope', '$timeout', '$cordovaCamera', function($scope, $timeout, $cordovaCamera){
   uid = localStorage.getItem("uid");
   uname = localStorage.getItem("name");
   console.log(uid);
   console.log(uname);
   $scope.goBack = function(){
		history.back();
	}
   $scope.feed = {};
   $scope.submitFeed = function(){
      var newBlogKey = db.ref().child("blogs").push().key;
      blogData = {
         blog_id: newBlogKey,
         title: $scope.feed.title,
         introduction: $scope.feed.introduction,
         user: {
            user_name: uname,
            user_id: localStorage.getItem("uid"),
            user_email: localStorage.getItem("email")
         },
         likes: 0,
         active: true,
         created_time: new Date().getTime(),
      };
      console.log(blogData);

      var re = /#(\w+)(?!\w)/g, hashTag, tagsValue = [];
      while (hashTag = re.exec($scope.feed.introduction)) {
         tagsValue.push(hashTag[1]);
      }
      console.log(tagsValue);

      // blog object update without tags, functional
      var updateBlog = {};
      updateBlog['/blogs/' + newBlogKey] = blogData;
      console.log(updateBlog);
      db.ref().update(updateBlog);

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
      db.ref().update(authUpdate);
   }

   $scope.galleryUpload = function() {
      var options = {
         destinationType : Camera.DestinationType.FILE_URI,
         sourceType :   Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
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
         sourceType :   Camera.PictureSourceType.CAMERA,
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
            alert('success');
            alert(JSON.stringify(response.Message));
            blogData.photoUrl = response.Message;
            alert(JSON.stringify(blogData));
         })
         .error(function(response){
            alert('error');
            alert(response);
         });
      }
      alert('source '+ source);
      img.src = source;
   }
}]);
