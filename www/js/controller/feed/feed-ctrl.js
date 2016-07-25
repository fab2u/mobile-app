app.controller('FeedCtrl', ['$scope', '$timeout', function($scope, $timeout){

	console.log('test');
	firstTimeLoad();

	// $scope.liked = false;
	// console.log($scope.liked);
	// $scope.likeThisFeed = function(id){
	// 	$scope.liked = !$scope.liked;
	// 	console.log($scope.liked);
	// }

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		firstTimeLoad();
		$scope.$broadcast('scroll.refreshComplete');
	}

	function firstTimeLoad(){
		var ref = db.ref().child("blogs").limitToLast(5);
		ref.once("value", function(snapshot){
			console.log(snapshot.val());
			console.log(Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]);
			console.log(Object.keys(snapshot.val())[0]);
			$scope.firstKey = Object.keys(snapshot.val())[0];
			$scope.events2 = [];
			angular.forEach(snapshot.val(), function(value, key){
				value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
				$scope.events2.push(value);
			});
		}, function(errorObject){
			console.log(errorObject);
		});
	}

	$scope.loadMore = function(){

	}
}]);
