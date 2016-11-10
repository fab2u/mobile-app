app.controller("FeedCtrl", function($scope, $timeout, $stateParams, $location, $ionicLoading,
										  $ionicModal, $ionicPopup,$state,$sce){

	$ionicLoading.show();
	$scope.blogLength = 0;
	$scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;

	$scope.uid = window.localStorage.getItem("uid");
	console.log($scope.uid)

	db.ref("users/data/"+$scope.uid+"/name").once("value", function(snapshot){
		console.log(snapshot.val());
		$scope.userName = snapshot.val();
		$ionicLoading.hide();
	});

	$scope.moreMessagesScroll = true;
	$scope.moreMessagesRefresh = true;
	// $scope.cityId = $stateParams.cityId;
	$scope.blogIdList = {};

	$scope.goBack = function(){
		$location.path("/app/home");
	}

	$scope.createNew = function(){
		$location.path("/new-feed");
	}

	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	// ----------------------------------------------------------------------
	$ionicModal.fromTemplateUrl('templates/feed/image-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});

	$scope.showImage = function(source) {
		$scope.imageSrc = source;
		$scope.openModal();
	}
	// ----------------------------------------------------------------------

	$scope.commentToggle = function(feedId) {
		$("#"+feedId+"-commentsBlock").toggle();
	};

	function showAlertLike() {
		var alertPopup = $ionicPopup.alert({
			title: 'Sign up for Fabbook',
			template: 'Join Fabbook to like this post.',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Join Now',
					type: 'button-custom',
					onTap: function(e) {
						$location.path("/login");
					}
				}
			]
		});
		alertPopup.then(function(res) {
		});
	};

	function showAlertFollow() {
		var alertPopup = $ionicPopup.alert({
			title: 'Sign up for Fabbook',
			template: 'Not on Fabbook? Sign up on Fab2u to follow this user.',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Join Now',
					type: 'button-custom',
					onTap: function(e) {
						$location.path("/login");
					}
				}
			]
		});
		alertPopup.then(function(res) {
		});
	};

	function showAlertComment() {
		var alertPopup = $ionicPopup.alert({
			title: 'Sign up for Fabbook',
			template: 'Join Fabbook to comment on this post.',
			buttons: [
				{ text: 'Cancel' },
				{
					text: 'Join Now',
					type: 'button-custom',
					onTap: function(e) {
						$location.path("/login");
					}
				}
			]
		});
		alertPopup.then(function(res) {
		});
	};

	$scope.showPopup = function(id) {
		if(!$scope.uid){
			showAlertComment();
		}
		else {
			$scope.data = {}
			var myPopup = $ionicPopup.show({
				template: '<input type="text" ng-model="data.comment">',
				title: 'Enter your Comment',
				// subTitle: 'Please use normal things',
				scope: $scope,
				buttons: [
					{text: 'Cancel'},
					{
						text: '<b>Comment</b>',
						type: 'button-positive',
						onTap: function (e) {
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
									created_time: new Date().getTime(),
									comment: $scope.data.comment,
									userId: $scope.uid,
									userName: $scope.userName
								};
								console.log(commentObject_blog);
								var updateComment = {};
								updateComment['blogs/' + id + '/comments/' + newCommentKey] = commentObject_blog;
								// updateComment['users/data/'+$scope.uid+"/comments/"+newCommentKey] = commentObject_user;
								db.ref().update(updateComment).then(function () {
									console.log('comment addedd successfully');
									// start: adding comment to particular feed
									var result = $.grep($scope.blogArr, function (e) {
										return e.blog_id == id;
									});
									console.log(result);
									if (result[0].commentCount == undefined) {
										result[0].commentCount = 0;
									}
									$timeout(function () {
										result[0].commentCount += 1;
										result[0].commentsArr.push(commentObject_blog);
										$("#" + id + "-commentsBlock").show();
									}, 0);
									// end: adding comment to particular feed
								});
								return $scope.data.comment;
							}
						}
					},
				]
			});
			myPopup.then(function (res) {
				console.log('Tapped!', res, id);
			});
		}
	};

	$scope.followUser = function(id) {
		if (!$scope.uid) {
			showAlertFollow();
		}
		else {
			console.log(id, $scope.uid);
			// id - post creator's uid
			// $scope.uid - my uid
			var updateFollow = {};
			updateFollow['users/data/' + id + '/myFollowers/' + $scope.uid] = true;
			updateFollow['users/data/' + $scope.uid + '/following/' + id] = true;
			db.ref().update(updateFollow).then(function () {
				console.log('success');
				$('.' + id + '-follow').hide();
				$("."+id+'-unfollow').css("display", "block");
				$state.go('feed')
			});
		}
	}

	$scope.unfollowUser = function(id){
		if(!$scope.uid){
			showAlertFollow();
		}
		else{
			var updateFollow = {};
			updateFollow['users/data/'+id+'/myFollowers/'+$scope.uid] = null;
			updateFollow['users/data/'+$scope.uid+'/following/'+id] = null;
			db.ref().update(updateFollow).then(function(){
				console.log('success');
				$('.'+id+'-follow').show();
				$("."+id+'-unfollow').css("display", "none");
				$state.go('feed')
			});
		}
	}

	$scope.likeThisFeed = function(feed){
		console.log("feed",feed)
		if(!$scope.uid){
			showAlertLike();
		}
		else{
			if($("#"+feed.blog_id+"-likeFeed").hasClass('clicked')){
				feed.numLikes -= 1;
				db.ref("blogs/"+feed.blog_id+"/likedBy/"+$scope.uid).remove().then(function(){
					db.ref("users/data/"+$scope.uid+"/likedBlogs/"+feed.blog_id).remove().then(function () {
						$("#"+feed.blog_id+"-likeFeed").removeClass("clicked");
					})
				});
				console.log("after remove",feed);
			}
			else {
				if (feed.numLikes == undefined) {
					feed.numLikes = 0;
				}
				feed.numLikes += 1;
				var updates = {};
				updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.uid] = true;
				updates["users/data/"+$scope.uid+"/likedBlogs/"+feed.blog_id] = true;
				db.ref().update(updates).then(function () {
					console.log('success');
					$("#" + feed.blog_id + "-likeFeed").addClass("clicked");
				});
				console.log("after add", feed);
			}
			db.ref("blogs/"+feed.blog_id+"/likedBy").on("value", function(snap){
				console.log(snap.numChildren());
				feed.numLikes = snap.numChildren();
			});
		}
	}

	$scope.doRefresh = function(){
		console.log('pull to refresh');
		db.ref("blogs").orderByKey().startAt($scope.topKey).once("value", function(snapshot){
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
		if(Object.keys($scope.blogIdList).length > 0){
			db.ref("blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
				// console.log(snap.val());
				if(snap.numChildren() == 1){
					$scope.moreMessagesScroll = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				else{
					// console.log($scope.bottomKey);
					$scope.oldBottomKey = $scope.bottomKey;
					$scope.bottomKey = Object.keys(snap.val())[0];
					// console.log($scope.bottomKey);
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
			db.ref("blogs").limitToLast(25).once('value', function(snapshot){
				$ionicLoading.hide();
				$scope.blogIdList = snapshot.val();
				// console.log($scope.blogIdList);
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				// console.log(Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1]);
				$scope.topKey = Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1];
				// console.log($scope.bottomKey);
				$scope.blogArr = [];
				$scope.blogLength = Object.keys($scope.blogIdList).length;

				for(var i in $scope.blogIdList){
					// console.log(i); // i is the key of blogs object or the id of each blog
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
	$scope.toTrustedHTML = function( html ){
		return $sce.trustAsHtml( html );
	}
	var cd = 0;
	function blogAlgo(i, callback){
		cd++;
		var blogData = db.ref().child("blogs").child(i);
		blogData.once("value", function(snap){ //access individual blog
			// console.log(i, snap.val());
			single_blog = snap.val();
			var temp = single_blog.introduction.replace(/\s/g, '');

			single_blog.introduction =  temp.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
			// single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');

			// start: comment system code
			if(single_blog.comments){
				single_blog['commentCount'] = Object.keys(single_blog.comments).length;
			}

			// start convert comments object to array
			single_blog['commentsArr'] = $.map(single_blog.comments, function(value, index) {
				return [value];
			});
			// console.log(value.commentsArr);
			// end convert comments object to array
			// end: comment system code

			// If you want to run asynchronous functions inside a loop, but still want to keep the index or other variables after a callback gets executed you can wrap your code in an IIFE (immediately-invoked function expression).
			(function(single_blog){
				if(single_blog.user){
					if(single_blog.user.user_id == $scope.uid){
						$timeout(function () {
							$('.'+single_blog.user.user_id+'-follow').hide();
						}, 0);
					}
					db.ref("users/data/"+single_blog.user.user_id).once("value", function(snap){
						// console.log(single_blog.user.user_id, snap.val());
						if(snap.val().photoUrl){
							single_blog.profilePic = snap.val().photoUrl;
						}
						if(snap.val().myFollowers){
							// console.log(snap.val().myFollowers);
							if ($scope.uid in snap.val().myFollowers){
								$timeout(function () {
									$('.'+single_blog.user.user_id+'-follow').hide();
									$("."+single_blog.user.user_id+'-unfollow').css("display", "block");
								}, 0);
							}
						}
					});
				}

			})(single_blog);
			if(single_blog.likedBy){
				count = Object.keys(single_blog.likedBy).length;
				single_blog['numLikes'] = count;
				if($scope.uid in single_blog.likedBy){
					$timeout(function () {
						$("#"+i+"-likeFeed").addClass("clicked");
					}, 1000);
				}
			}
			$scope.blogArr.push(single_blog);
		});
		if (callback) {
			callback();
		}
		if(cd == $scope.blogLength){
			$scope.moreMessagesScroll = true;
		}
	}
});
