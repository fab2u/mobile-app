app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', '$location', '$ionicLoading', '$ionicModal', '$ionicPopup', function($scope, $timeout, $stateParams, $location, $ionicLoading, $ionicModal, $ionicPopup){



	$ionicLoading.show();

  var userStatus = firebase.auth().currentUser;
  console.log(userStatus);

  if(!userStatus){
    showAlert();
  }

  function showAlert(){
    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
      title: 'Sign up for Fabbook',
      template: 'Not on Fabbook? Sign up on Fab2u now.',
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
  }

	$scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;

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

	var myUid = window.localStorage.getItem("uid");
	db.ref("users/data/"+myUid+"/name").on('value', function(snapshot){
		console.log(snapshot.val());
		$scope.myName = snapshot.val();
	});

	var uid = $stateParams.user_id;
	$scope.blogIdList = {};
	$scope.moreMessagesScroll = true;

	db.ref("users/data/"+uid).on("value", function(snapshot){
		console.log(snapshot.val());
		$scope.following = Object.keys(snapshot.val().following).length;
		$scope.userDetails = snapshot.val();
		$scope.email = snapshot.val().email.userEmail;
		$scope.userPhoto = snapshot.val().photoUrl;
		$scope.numFeeds = Object.keys(snapshot.val().blogs).length;
		$scope.followers = Object.keys(snapshot.val().myFollowers).length;
	});

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
		// id ==> feedId
    if(!userStatus){
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
                  userId: myUid,
                  userName: $scope.myName
                };
                console.log(commentObject_blog);
                var updateComment = {};
                updateComment['blogs/' + id + '/comments/' + newCommentKey] = commentObject_blog;
                // updateComment['users/data/'+myUid+"/comments/"+newCommentKey] = commentObject_user;
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

	$scope.likeThisFeed = function(feedId){
    if(!userStatus){
      showAlertLike();
    }
    else {
      if ($("#" + feedId + "-likeFeed").hasClass('clicked')) {
        console.log('inside remove');
        var result = $.grep($scope.blogArr, function (e) {
          return e.blog_id == feedId;
        });
        console.log(result);
        result[0].numLikes -= 1;
        db.ref("blogs/" + feedId + "/likedBy/" + myUid).remove().then(function () {
          console.log('removed successfully');
          $("#" + feedId + "-likeFeed").removeClass("clicked");
        });
      }
      else {
        console.log(feedId, myUid);
        var result = $.grep($scope.blogArr, function (e) {
          return e.blog_id == feedId;
        });
        console.log(result);
        if (result[0].numLikes == undefined) {
          result[0].numLikes = 0;
        }
        result[0].numLikes += 1;
        var updates = {};
        updates["blogs/" + feedId + "/likedBy/" + myUid] = true;
        db.ref().update(updates).then(function () {
          console.log('success');
          $("#" + feedId + "-likeFeed").addClass("clicked");
        });
      }
      db.ref("blogs/" + feedId + "/likedBy").on("value", function (snap) {
        console.log(snap.numChildren());
      });
    }
	}

	$scope.loadMore = function(){
		console.log('loadmore');
		console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			console.log($scope.bottomKey);
			db.ref("users/data/"+uid+"/blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
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
							blogAlgo(i);
						}
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			db.ref("users/data/"+uid +"/blogs").limitToLast(25).once("value", function(snapshot){
				$scope.blogIdList = snapshot.val();
				console.log($scope.blogIdList);
				if($scope.blogIdList !== null){
					$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				}
				$scope.blogArr = [];
				for(var i in snapshot.val()){
					blogAlgo(i);
				}
				$ionicLoading.hide();
				$timeout(function () {
				}, 0);
			});
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
			single_blog.profilePic = $scope.userPhoto;

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

			if(single_blog.likedBy){
				count = Object.keys(single_blog.likedBy).length;
				// console.log(single_blog.likedBy);
				// console.log(count);
				single_blog['numLikes'] = count;
				if(myUid in single_blog.likedBy){
					$timeout(function () {
						$("#"+i+"-likeFeed").addClass("clicked");
					}, 1000);
				}
			}
			// console.log($scope.blogArr);
			$scope.blogArr.push(single_blog);
		});
		if(callback){
			callback();
		}
	}
}]);
