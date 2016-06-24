app.controller("newFeedCtrl", ['$scope', '$timeout', function($scope, $timeout){
   uid = localStorage.getItem("uid");
   uname = localStorage.getItem("name");
   console.log(uid);
   console.log(uname);
   $scope.feed = function(){
      var newBlogKey = db.ref().child("blogs").push().key;
      var blogData = {
         blog_id: newBlogKey,
         title: $scope.title,
         introduction: $scope.introduction,
         user: {
            user_name: uname,
            user_id: localStorage.getItem("uid"),
            user_email: localStorage.getItem("email")
         },
         banner: {
            banner_url: $scope.banner_url,
            banner_type: $scope.banner_type
         },
         likes: 0,
         active: true,
         created_time: new Date().getTime(),
      };

      var re = /#(\w+)(?!\w)/g, hashTag, tagsValue = [];
      while (hashTag = re.exec($scope.introduction)) {
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
}]);
