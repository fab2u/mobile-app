app.controller('FeedCtrl', ['$scope', '$timeout', '$location', '$ionicLoading', '$cordovaSocialSharing', '$ionicPopup', function($scope, $timeout, $location, $ionicLoading, $cordovaSocialSharing, $ionicPopup){

	$ionicLoading.show();

	console.log('test');
	$scope.uid = window.localStorage.getItem("uid");
	db.ref("users/data/"+$scope.uid+"/name").once("value", function(snapshot){
		console.log(snapshot.val());
		$scope.userName = snapshot.val();
		$ionicLoading.hide();
	})
	console.log(JSON.parse(window.localStorage.getItem('selectedLocation')));
	$scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;
	console.log($scope.cityId);
	console.log($scope.uid);
	$scope.events2 = [];
	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;

	$scope.showPopup = function(id) {
	   $scope.data = {}
		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.comment">',
			title: 'Enter your Comment',
			// subTitle: 'Please use normal things',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Comment</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.comment) {
							e.preventDefault();
						} else {
							console.log(id);
							var newCommentKey = db.ref().push().key;
							// var commentObject_user = {
							// 	blogId: id,
							// 	comment: res,
								// commentId: newCommentKey
							// };
							var commentObject_blog = {
								blogId: id,
								comment: $scope.data.comment,
								userId: $scope.uid,
								userName: $scope.userName
							};
							console.log(commentObject_blog);
							var updateComment = {};
							updateComment['blogs/'+id+'/comments/'+newCommentKey] = commentObject_blog;
							// updateComment['users/data/'+$scope.uid+"/comments/"+newCommentKey] = commentObject_user;
							db.ref().update(updateComment).then(function(){
								console.log('comment addedd successfully');
							});
							return $scope.data.comment;
						}
					}
				},
			]
		});
		myPopup.then(function(res) {
			console.log('Tapped!', res, id);
		});
	};

	$scope.goBack = function(){
		$location.path("/app/home");
	}

	$scope.createNew = function(){
		$location.path("/new-feed");
	}

	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.otherShare = function(){
		alert('called');
		message = 'This is your message';
		subject = 'Subject Line';
		file = null;
		link = 'www.google.com';

		$cordovaSocialSharing
		.share(message, subject, file, link)
		.then(function(result) {
			alert(JSON.stringify(result));
		}, function(err) {
			alert(JSON.stringify(err));
		});
	}

	$scope.followUser = function(id){
		console.log(id, $scope.uid);
		// id - post creator's uid
		// $scope.uid - my uid
		var updateFollow = {};
		updateFollow['users/data/'+id+'/myFollowers/'+$scope.uid] = true;
		updateFollow['users/data/'+$scope.uid+'/following/'+id] = true;
		db.ref().update(updateFollow).then(function(){
			console.log('success');
			$('.'+id+'-follow').hide();
		});
	}

	$scope.likeThisFeed = function(feedId){
		if($("#"+feedId+"-likeFeed").hasClass('clicked')){
			console.log('inside remove');
			var result = $.grep($scope.events2, function(e){ return e.blog_id == feedId; });
			console.log(result);
			result[0].numLikes -= 1;
			db.ref("blogs/"+feedId+"/likedBy/"+$scope.uid).remove().then(function(){
				console.log('removed successfully');
				$("#"+feedId+"-likeFeed").removeClass("clicked");
				console.log($scope.events2);
			});
		}
		else {
			console.log(feedId, $scope.uid);
			var result = $.grep($scope.events2, function(e){ return e.blog_id == feedId; });
			console.log(result[0].numLikes);
			if(result[0].numLikes == undefined){
				result[0].numLikes = 0;
			}
			result[0].numLikes += 1;
			var updates = {};
			updates["blogs/"+feedId+"/likedBy/"+$scope.uid] = true;
			db.ref().update(updates).then(function(){
				console.log('success');
				$("#"+feedId+"-likeFeed").addClass("clicked");
				console.log($scope.events2);
			});
		}
		db.ref("blogs/"+feedId+"/likedBy").on("value", function(snap){
			console.log(snap.numChildren());
		});
	}

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		db.ref("blogs").orderByKey().startAt($scope.topKey).once('value', function(snapshot){
			if(snapshot.numChildren() == 1){
				$scope.moreMessagesRefresh = false;
			}
			else{
				console.log(snapshot.val());
				$scope.prevTopKey = $scope.topKey;
				$scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
				angular.forEach(snapshot.val(), function(value, key){
					console.log(key, $scope.prevTopKey);
					if (key != $scope.prevTopKey){
						value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
						if(value.comments){
							value['commentCount'] = Object.keys(value.comments).length;
						}
						if(value.user.user_id == $scope.uid){
							console.log('both equal');
							$timeout(function () {
								$('.'+value.user.user_id+'-follow').hide();
							}, 0);
						}
						db.ref("users/data/"+value.user.user_id).once("value", function(snap){
							console.log(value.user.user_id, snap.val());
							if(snap.val().photoUrl){
								value.profilePic = snap.val().photoUrl;
							}
							if(snap.val().myFollowers){
								console.log(snap.val().myFollowers);
								if ($scope.uid in snap.val().myFollowers){
									$('.'+value.user.user_id+'-follow').hide();
								}
							}
						});
						if(value.likedBy){
							count = Object.keys(value.likedBy).length;
							console.log(value.likedBy);
							console.log(count);
							value['numLikes'] = count;
							if($scope.uid in value.likedBy){
								$timeout(function () {
									$("#"+key+"-likeFeed").addClass("clicked");
								}, 1000);
							}
						}
						$scope.events2.unshift(value);
					}
				});
			}
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.loadMore = function(){

		if($scope.events2.length > 0){
			console.log($scope.bottomKey);
			db.ref("blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
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
							if(value.comments){
								value['commentCount'] = Object.keys(value.comments).length;
							}
							console.log(value.user.user_id, $scope.uid);
							if(value.user.user_id == $scope.uid){
								console.log('both equal');
								$timeout(function () {
									$('.'+value.user.user_id+'-follow').hide();
								}, 0);
							}
							db.ref("users/data/"+value.user.user_id).once("value", function(snap){
								console.log(value.user.user_id, snap.val());
								if(snap.val().photoUrl){
									value.profilePic = snap.val().photoUrl;
								}
								if(snap.val().myFollowers){
									console.log(snap.val().myFollowers);
									if ($scope.uid in snap.val().myFollowers){
										$('.'+value.user.user_id+'-follow').hide();
									}
								}
							});

							if(value.likedBy){
								count = Object.keys(value.likedBy).length;
								console.log(value.likedBy);
								console.log(count);
								value['numLikes'] = count;
								if($scope.uid in value.likedBy){
									$timeout(function () {
										$("#"+key+"-likeFeed").addClass("clicked");
									}, 1000);
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
			db.ref().child("blogs").limitToLast(25).once("value", function(snapshot){
				$ionicLoading.hide();
				// console.log(snapshot.val());
				// console.log(Object.keys(snapshot.val())[0]);
				$scope.bottomKey = Object.keys(snapshot.val())[0];
				// console.log(Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1]);
				$scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
				// console.log($scope.bottomKey, $scope.topKey);
				angular.forEach(snapshot.val(), function(value, key){
					value.introduction = value.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
					if(value.comments){
						value['commentCount'] = Object.keys(value.comments).length;
					}

					// start convert comments object to array
					value['commentsArr'] = $.map(value.comments, function(value, index) {
						return [value];
					});
					console.log(value.commentsArr);
					// end convert comments object to array

					// console.log(value.user.user_id, $scope.uid);
					if(value.user.user_id == $scope.uid){
						// console.log('both equal');
						$timeout(function () {
							$('.'+value.user.user_id+'-follow').hide();
						}, 0);
					}
					db.ref("users/data/"+value.user.user_id).once("value", function(snap){
						// console.log(value.user.user_id, snap.val());
						if(snap.val().photoUrl){
							value.profilePic = snap.val().photoUrl;
						}
						if(snap.val().myFollowers){
							// console.log(snap.val().myFollowers);
							if ($scope.uid in snap.val().myFollowers){
								$('.'+value.user.user_id+'-follow').hide();
							}
						}
					});
					if(value.likedBy){
						count = Object.keys(value.likedBy).length;
						// console.log(value.likedBy);
						// console.log(count);
						value['numLikes'] = count;
						if($scope.uid in value.likedBy){
							$timeout(function () {
								$("#"+key+"-likeFeed").addClass("clicked");
							}, 1000);
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
