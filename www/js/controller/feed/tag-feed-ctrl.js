app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', function($scope, $stateParams, $timeout){

	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;
	$scope.tagName = $stateParams.tag;
	console.log($scope.tagName);
	$scope.blogIdList = {};

	$scope.goBack = function(){
		history.back();
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
				var single_blog = {};
				for(var i in snapshot.val()){
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
			}
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.loadMore = function(){
		console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			console.log($scope.bottomKey);
			db.ref("tags/"+$scope.tagName+"/blogs").orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
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
			});
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			console.log("length = 0");
			db.ref('tags').child($scope.tagName).child("blogs").limitToLast(5).once('value', function(snapshot){
				$scope.blogIdList = snapshot.val();
				console.log($scope.blogIdList);
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				console.log(Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1]);
				$scope.topKey = Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1];
				console.log($scope.bottomKey);
				$scope.blogArr = [];
				for(var i in $scope.blogIdList){
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
			})
		}
	}
	$scope.$on('$stateChangeSuccess', function() {
   	$scope.loadMore();
	});

}]);
