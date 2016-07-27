// Edit By Deepank
app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', function($scope, $timeout, $stateParams){
   $scope.user_id = $stateParams.user_id;
   $scope.email = window.localStorage.email;
   $scope.img_hash = md5($scope.email);
   jdenticon.update("#identicon", $scope.img_hash);
   var uid = window.localStorage.uid;
   $scope.blogIdList = {};
   $scope.moreMessagesScroll = true;

   $scope.goBack = function(){
		history.back();
	}

   $scope.loadMore = function(){
      console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			console.log($scope.bottomKey);
         db.ref("users/data/"+uid+"/blogs").orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
            console.log(snap.val());
            if(snap.numChildren() == 1){
					$scope.moreMessagesScroll = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				else{
					$scope.bottomKey = Object.keys(snap.val())[0];
					for(var i in snap.val()){
						// console.log(i); // i is the key of blogs object or the id of each blog
						var blogData = db.ref().child("blogs").child(i);
						blogData.once("value", function(snap){ //access individual blog
							// console.log(snap.val());
							single_blog = snap.val();
							single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
							$scope.blogArr.push(single_blog);
							// console.log($scope.blogArr);
						});
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
         })
      }
      else if(Object.keys($scope.blogIdList).length == 0){
         db.ref("users/data/"+uid +"/blogs").limitToLast(5).once("value", function(snapshot){
            console.log(snapshot.val());
            $scope.blogIdList = snapshot.val();
				console.log($scope.blogIdList);
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
            $scope.blogArr = [];
            for(var i in snapshot.val()){
               var blogData = db.ref("blogs/" + i);
               blogData.once("value", function(snap){
                  single_blog = snap.val();
                  single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
                  console.log(single_blog);
      				$scope.blogArr.push(single_blog);
               });
            }
            $timeout(function () {
				}, 0);
         });
      }
   }
   $scope.$on('$stateChangeSuccess', function() {
   	$scope.loadMore();
	});

}]);
