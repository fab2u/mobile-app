// Edit By Deepank
app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', function($scope, $timeout, $stateParams){
   $scope.user_id = $stateParams.user_id;
   $scope.email = window.localStorage.email;
   $scope.img_hash = md5($scope.email);
   jdenticon.update("#identicon", $scope.img_hash);
   var uid = window.localStorage.uid;
   var ref = db.ref("users/data/"+uid +"/blogs");
   ref.on("value", function(snapshot){
      $scope.blogArr = [];
      for(var i in snapshot.val()){
         var blogData = db.ref("blogs/" + i);
         blogData.on("value", function(snap){
            single_blog = snap.val();
            single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
            console.log(single_blog);
				$scope.blogArr.push(single_blog);
         });
      }
   });
}]);
