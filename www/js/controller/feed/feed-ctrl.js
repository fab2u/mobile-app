app.controller('FeedCtrl', ['$scope', '$timeout', function($scope, $timeout){

	console.log('test');
	$scope.uid = window.localStorage.getItem("uid");
	console.log($scope.uid);
	$scope.events2 = [];
	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;

	// $scope.liked = false;
	// console.log($scope.liked);
	// $scope.likeThisFeed = function(id){
	// 	$scope.liked = !$scope.liked;
	// 	console.log($scope.liked);
	// }

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		db.ref("blogs").orderByKey().startAt($scope.topKey).once('value', function(snapshot){
			if(snapshot.numChildren() == 1){
				$scope.moreMessagesRefresh = false;
			}
			else{
				console.log(snapshot.val());
				angular.forEach(snapshot.val(), function(value, key){
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
					console.log(Object.keys(snap.val())[0]);
					$scope.bottomKey = Object.keys(snap.val())[0];
					var count = 0;
					angular.forEach(snap.val(), function(value, key){
						value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
						$scope.events2.push(value);
						console.log(value);
						// console.log($scope.events2);
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
				angular.forEach(snapshot.val(), function(value, key){
					value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
					$scope.events2.push(value);
				});
			}, function(errorObject){
				console.log(errorObject);
			});
		}
	}
	$scope.$on('$stateChangeSuccess', function() {
   	$scope.loadMore();
	});
}]);
