app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', function($scope, $stateParams, $timeout){

	$scope.tagName = $stateParams.tag;
	console.log($scope.tagName);
	var ref = db.ref().child("tags").child($scope.tagName);
	ref.once("value", function(snapshot){
		// console.log(snapshot.val());
		// console.log(snapshot.val().blogs);
		blogList = snapshot.val().blogs;
		console.log(blogList);
		$scope.blogArr = [];
		for(var i in blogList){
			console.log(i); // i is the key of blogs object or the id of each blog
			var blogData = db.ref().child("blogs").child(i);
			blogData.once("value", function(snap){ //access individual blog
				console.log(snap.val());
				single_blog = snap.val();
				$scope.blogArr.push(single_blog);
				console.log($scope.blogArr);
			});
		}
	})

}]);


//working slow code
// app.controller("tagFeedCtrl", ['$scope', '$stateParams', '$timeout', function($scope, $stateParams, $timeout){
//
// 	$scope.tagName = $stateParams.tag;
// 	console.log($scope.tagName);
// 	var ref = db.ref().child("tags").child($scope.tagName);
// 	ref.once("value", function(snapshot){
// 		// console.log(snapshot.val());
// 		// console.log(snapshot.val().blogs);
// 		blogList = snapshot.val().blogs;
// 		console.log(blogList);
// 		$scope.blogArr = [];
// 		for(var i in blogList){
// 			console.log(i); // i is the key of blogs object or the id of each blog
// 			var blogData = db.ref().child("blogs").child(i);
// 			blogData.once("value", function(snap){ //access individual blog
// 				console.log(snap.val());
// 				single_blog = snap.val();
// 				$scope.blogArr.push(single_blog);
// 				console.log($scope.blogArr);
// 			});
// 		}
// 	})
//
// }]);
