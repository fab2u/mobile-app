app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', '$location', '$ionicLoading', function($scope, $stateParams, $timeout, $location, $ionicLoading){

	$ionicLoading.show();
	$scope.uid = window.localStorage.getItem("uid");
	console.log($scope.uid);

	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;
	$scope.tagName = $stateParams.tag;
	console.log($scope.tagName);
	$scope.blogIdList = {};

	$scope.goBack = function(){
		history.back();
	}

	$scope.createNew = function(){
		$location.path("/new-feed");
	}

	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.likeThisFeed = function(feedId){
		if($("#"+feedId+"-likeFeed").hasClass('clicked')){
			console.log('inside remove');
			var result = $.grep($scope.blogArr, function(e){ return e.blog_id == feedId; });
			console.log(result);
			result[0].numLikes -= 1;
			db.ref("blogs/"+feedId+"/likedBy/"+$scope.uid).remove().then(function(){
				console.log('removed successfully');
				$("#"+feedId+"-likeFeed").removeClass("clicked");
			});
		}
		else {
			console.log(feedId, $scope.uid);
			var result = $.grep($scope.blogArr, function(e){ return e.blog_id == feedId; });
			console.log(result);
			if(result[0].numLikes == undefined){
				result[0].numLikes = 0;
			}
			result[0].numLikes += 1;
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

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		db.ref("tags/"+$scope.tagName+"/blogs").orderByKey().startAt($scope.topKey).once("value", function(snapshot){
			console.log(snapshot.val());
			if(snapshot.numChildren() == 1){
				console.log('one child');
				$scope.moreMessagesRefresh = false;
			}
			else{
				console.log(snapshot.val());
				$scope.prevTopKey = $scope.topKey;
				$scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
				var single_blog = {};
				for(var i in snapshot.val()){
					// console.log(i); // i is the key of blogs object or the id of each blog
					if (i != $scope.prevTopKey){
						blogAlgo(i);
					}
				}
			}
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.loadMore = function(){
		console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			db.ref("tags/"+$scope.tagName+"/blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
				console.log(snap.val());
				if(snap.numChildren() == 1){
					$scope.moreMessagesScroll = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				else{
					console.log($scope.bottomKey);
					$scope.oldBottomKey = $scope.bottomKey;
					$scope.bottomKey = Object.keys(snap.val())[0];
					console.log($scope.bottomKey);
					for(var i in snap.val()){
						// console.log(i); // i is the key of blogs object or the id of each blog
						if (i != $scope.oldBottomKey){
							blogAlgo(i);
						}
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			console.log("length = 0");
			db.ref('tags').child($scope.tagName).child("blogs").limitToLast(25).once('value', function(snapshot){
				$ionicLoading.hide();
				$scope.blogIdList = snapshot.val();
				console.log($scope.blogIdList);
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				console.log(Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1]);
				$scope.topKey = Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1];
				console.log($scope.bottomKey);
				$scope.blogArr = [];
				for(var i in $scope.blogIdList){
					console.log(i); // i is the key of blogs object or the id of each blog
					blogAlgo(i);
				}
				$timeout(function () {
				}, 0);
			})
		}
	}
	$scope.$on('$stateChangeSuccess', function() {
		$scope.loadMore();
	});

	function blogAlgo(i, callback){
		var blogData = db.ref().child("blogs").child(i);
		blogData.once("value", function(snap){ //access individual blog
			// console.log(snap.val());
			single_blog = snap.val();
			single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
			db.ref("users/data/"+single_blog.user.user_id+"/photoUrl").once("value", function(snap){
				console.log(snap.val());
				single_blog.profilePic = snap.val();
			});
			// $timeout(function () {
			// 	jdenticon.update("#"+snap.val().blog_id, md5(snap.val().user.user_id));
			// }, 0);
			if(single_blog.likedBy){
				count = Object.keys(single_blog.likedBy).length;
				console.log(single_blog.likedBy);
				console.log(count);
				single_blog['numLikes'] = count;
				if($scope.uid in single_blog.likedBy){
					$timeout(function () {
						$("#"+i+"-likeFeed").addClass("clicked");
					}, 1000);
				}
			}
			$scope.blogArr.push(single_blog);
			// console.log($scope.blogArr);
		});
		if(callback){
			callback();
		}
	}

}]);
