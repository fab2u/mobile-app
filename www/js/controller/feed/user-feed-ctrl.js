// Edit By Deepank
app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', function($scope, $timeout, $stateParams){
	$scope.user_id = $stateParams.user_id;
	$scope.email = window.localStorage.email;
	$scope.img_hash = md5($scope.user_id);
	jdenticon.update("#identicon", $scope.img_hash);
	var uid = window.localStorage.uid;
	$scope.blogIdList = {};
	$scope.moreMessagesScroll = true;

	db.ref("users/data/"+uid).once("value", function(snapshot){
		console.log(snapshot.val());
		$scope.userDetails = snapshot.val();
	});

	$scope.goBack = function(){
		history.back();
	}

	$scope.likeThisFeed = function(feedId){
		if($("#"+feedId+"-likeFeed").hasClass('clicked')){
			console.log('inside remove');
			db.ref("blogs/"+feedId+"/likedBy/"+$scope.uid).remove().then(function(){
				console.log('removed successfully');
				$("#"+feedId+"-likeFeed").removeClass("clicked");
			});
		}
		else {
			console.log(feedId, $scope.uid);
			var updates = {};
			updates["blogs/"+feedId+"/likedBy/"+$scope.uid] = true;
			db.ref().update(updates).then(function(){
				console.log('success');
				$("#"+feedId+"-likeFeed").addClass("clicked");
			});
		}
		db.ref("blogs/"+feedId+"/likedBy").on("value", function(snap){
			console.log(snap.numChildren());
		});
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
					$scope.oldBottomKey = $scope.bottomKey;
					$scope.bottomKey = Object.keys(snap.val())[0];
					for(var i in snap.val()){
						// console.log(i); // i is the key of blogs object or the id of each blog
						if (i != $scope.oldBottomKey){
							var blogData = db.ref().child("blogs").child(i);
							blogData.once("value", function(snap){ //access individual blog
								// console.log(snap.val());
								single_blog = snap.val();
								single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
								$timeout(function () {
									jdenticon.update("#"+single_blog.blog_id, md5(single_blog.user.user_id));
								}, 0);
								if(single_blog.likedBy){
									count = Object.keys(single_blog.likedBy).length;
									console.log(single_blog.likedBy);
									console.log(count);
									if($scope.uid in single_blog.likedBy){
										$timeout(function () {
											$("#"+i+"-likeFeed").addClass("clicked");
										}, 0);
									}
								}
								$scope.blogArr.push(single_blog);
								// console.log($scope.blogArr);
							});
						}
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			db.ref("users/data/"+uid +"/blogs").limitToLast(5).once("value", function(snapshot){
				$scope.blogIdList = snapshot.val();
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				$scope.blogArr = [];
				for(var i in snapshot.val()){
					var blogData = db.ref("blogs/" + i);
					blogData.once("value", function(snap){
						single_blog = snap.val();
						single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
						$timeout(function () {
							jdenticon.update("#"+single_blog.blog_id, md5(single_blog.user.user_id));
						}, 0);
						if(single_blog.likedBy){
							count = Object.keys(single_blog.likedBy).length;
							console.log(single_blog.likedBy);
							console.log(count);
							if($scope.uid in single_blog.likedBy){
								$timeout(function () {
									$("#"+i+"-likeFeed").addClass("clicked");
								}, 0);
							}
						}
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
