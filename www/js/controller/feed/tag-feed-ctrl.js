app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', function($scope, $stateParams, $timeout){

	$scope.moreMessagesScroll = true;
	$scope.tagName = $stateParams.tag;
	console.log($scope.tagName);
	$scope.blogIdList = {};

	$scope.loadMore = function(){
		console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			console.log($scope.bottomKey);
			db.ref("tags/"+$scope.tagName).orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
				console.log(snap.val());
			});
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			db.ref('tags').child($scope.tagName).limitToLast(3).once('value', function(snapshot){
				$scope.blogIdList = snapshot.val().blogs;
				console.log($scope.blogIdList);
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				console.log($scope.bottomKey);
				$scope.blogArr = [];
				for(var i in $scope.blogIdList){
					// console.log(i); // i is the key of blogs object or the id of each blog
					var blogData = db.ref().child("blogs").child(i);
					blogData.once("value", function(snap){ //access individual blog
						// console.log(snap.val());
						single_blog = snap.val();
						single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
						$scope.blogArr.unshift(single_blog);
						// console.log($scope.blogArr);
					});
				}
			})
		}
	}
	$scope.$on('$stateChangeSuccess', function() {
   	$scope.loadMore();
	});

	// db.ref().child("tags/"+$scope.tagName).once("value", function(snapshot){
	// 	$scope.blogIdList = snapshot.val().blogs;
	// 	console.log($scope.blogIdList);
	// 	$scope.blogArr = [];
	// 	for(var i in $scope.blogIdList){
	// 		console.log(i); // i is the key of blogs object or the id of each blog
	// 		var blogData = db.ref().child("blogs").child(i);
	// 		blogData.once("value", function(snap){ //access individual blog
	// 			console.log(snap.val());
	// 			single_blog = snap.val();
	// 			single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
	// 			$scope.blogArr.unshift(single_blog);
	// 			console.log($scope.blogArr);
	// 		});
	// 	}
	// })

}]);
