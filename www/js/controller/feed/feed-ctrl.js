app.controller('FeedCtrl', ['$scope', '$timeout', function($scope, $timeout){

	console.log('test');
	$scope.uid = window.localStorage.getItem("uid");
	console.log($scope.uid);
	$scope.events2 = [];
	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;

	$scope.goBack = function(){
		history.back();
	}

	$scope.likeThisFeed = function(feedId){
      if($("#"+feedId+"-likeFeed").hasClass('clicked')){
         console.log('inside remove');
         db.ref("blogs/"+feedId+"/likedBy/"+$scope.uid).remove().then(function(){
				db.ref("blogs/"+feedId+"/likedBy").on("value", function(snap){
					console.log(snap.numChildren());
				});
            console.log('removed successfully');
				$("#"+feedId+"-likeFeed").removeClass("clicked");
         });
      }
      else {
         console.log(feedId, $scope.uid);
         var updates = {};
         updates["blogs/"+feedId+"/likedBy/"+$scope.uid] = true;
         db.ref().update(updates).then(function(){
				db.ref("blogs/"+feedId+"/likedBy").on("value", function(snap){
					console.log(snap.numChildren());
				});
            console.log('success');
            $("#"+feedId+"-likeFeed").addClass("clicked");
         });
      }
   }

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		db.ref("blogs").orderByKey().startAt($scope.topKey).once('value', function(snapshot){
			if(snapshot.numChildren() == 1){
				$scope.moreMessagesRefresh = false;
			}
			else{
				console.log(snapshot.val());
				$scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
				angular.forEach(snapshot.val(), function(value, key){
					value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
					$timeout(function () {
						jdenticon.update("#"+value.blog_id, md5(value.user.user_id));
					}, 0);
					if(value.likedBy){
						count = Object.keys(value.likedBy).length;
						console.log(value.likedBy);
						console.log(count);
						if($scope.uid in value.likedBy){
		               $timeout(function () {
		                  // $("#"+key+"-yesBtn").addClass("clicked");
								$("#"+key+"-likeFeed").addClass("clicked");
		               }, 0);
		            }
					}
					$scope.events2.unshift(value);
				});
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.loadMore = function(){

		if($scope.events2.length > 0){
			console.log($scope.bottomKey);
			db.ref("blogs").orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
				console.log(snap.numChildren(), $scope.moreMessagesScroll);
				if(snap.numChildren() == 1){
					$scope.moreMessagesScroll = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				else{
					console.log(snap.val());
					console.log($scope.bottomKey);
					$scope.oldBottomKey = $scope.bottomKey;
					console.log(Object.keys(snap.val())[0]);
					$scope.bottomKey = Object.keys(snap.val())[0];
					angular.forEach(snap.val(), function(value, key){
						if(key != $scope.oldBottomKey){
							value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
							$timeout(function () {
								jdenticon.update("#"+value.blog_id, md5(value.user.user_id));
							}, 0);
							if(value.likedBy){
								count = Object.keys(value.likedBy).length;
								console.log(value.likedBy);
								console.log(count);
								if($scope.uid in value.likedBy){
				               $timeout(function () {
				                  // $("#"+key+"-yesBtn").addClass("clicked");
										$("#"+key+"-likeFeed").addClass("clicked");
				               }, 0);
				            }
							}
							$scope.events2.push(value);
						}
					});
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
		}
		else if($scope.events2.length == 0){
			db.ref().child("blogs").limitToLast(5).once("value", function(snapshot){
				console.log(snapshot.val());
				console.log(Object.keys(snapshot.val())[0]);
				$scope.bottomKey = Object.keys(snapshot.val())[0];
				console.log(Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]);
				$scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
				console.log($scope.bottomKey, $scope.topKey);
				angular.forEach(snapshot.val(), function(value, key){
					value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
					$timeout(function () {
						console.log(value.user.user_id);
						jdenticon.update("#"+value.blog_id, md5(value.user.user_id));
					}, 0);
					if(value.likedBy){
						count = Object.keys(value.likedBy).length;
						console.log(value.likedBy);
						console.log(count);
						if($scope.uid in value.likedBy){
		               $timeout(function () {
		                  // $("#"+key+"-yesBtn").addClass("clicked");
								$("#"+key+"-likeFeed").addClass("clicked");
		               }, 0);
		            }
					}
					$scope.events2.push(value);
				});
				$timeout(function () {
				}, 0);
			}, function(errorObject){
				console.log(errorObject);
			});
		}
	}
	$scope.$on('$stateChangeSuccess', function() {
   	$scope.loadMore();
	});
}]);
