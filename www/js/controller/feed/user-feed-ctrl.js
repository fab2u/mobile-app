app.controller("userFeedCtrl", function($scope, $timeout, $stateParams,$cordovaCamera,$http,
                                        $location, $ionicLoading, $ionicModal, $ionicPopup){

	$ionicLoading.show();


    $scope.myBlogIds = [];
    $scope.myFollowingBlogIds = [];
    $scope.followingIds ='';
    $scope.count1 = 0;
    $scope.count2 = 0;

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

  if(!myUid){
    showAlert();
  }


  db.ref("users/data/"+uid).on("value", function(snapshot){
    $scope.totalLikes = 0;
      $scope.following = Object.keys(snapshot.val().following).length;
      $scope.userDetails = snapshot.val();
      $scope.email = snapshot.val().email.userEmail;
      $scope.userPhoto = snapshot.val().photoUrl;
      $scope.numFeeds = Object.keys(snapshot.val().blogs).length;
      $scope.followers = Object.keys(snapshot.val().myFollowers).length;
    for(var i in snapshot.val().blogs){
      db.ref("blogs/"+i).on("value", function(snap){
        if(snap.val().likedBy){
          $scope.totalLikes += Object.keys(snap.val().likedBy).length;
        }
      });
    }
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
    if(!myUid){
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
    if(!myUid){
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
	};


	////////////////// following blogs id ////////////////

    $scope.storedIds = [];
    var blogsNum= 0;
    var blogCount = 0;
    var count12 = 0;
    var followingNum = 0;

    function allBlogIds(myBlogIds,followingIds) {
     var finalBlogIds = _.union(myBlogIds,followingIds);
        if(finalBlogIds){
            for(var i = 0; i<finalBlogIds.length;i++){
                	blogAlgo(finalBlogIds[i]);
            }
        }
    }

    function getBlogIds(id) {
        db.ref("users/data/"+id+"/blogs").once('value', function(snapshot){
            blogsNum += Object.keys(snapshot.val()).length;
            count12++;
            for(var blogId in snapshot.val()){
                blogCount++;
                $scope.storedIds.push(blogId);
                if(blogsNum == blogCount && followingNum == count12) {
                    allBlogIds($scope.myBlogIds,$scope.storedIds)
                }
            }
        })
    }

    function myFollowing(followingId){
        for(var id in followingId){
            getBlogIds(id);
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
                if($scope.blogIdList !== null){
                	$scope.bottomKey = Object.keys($scope.blogIdList)[0];
                }
                $scope.blogArr = [];
                for(var i in snapshot.val()){
                    $scope.myBlogIds.push(i);
                	// blogAlgo(i);
                }
                db.ref("users/data/"+uid+"/following").once("value",function (response) {
                    if(response.val()){
                        $scope.followingIds = response.val();
                    }
                })
                if($scope.followingIds){
                    followingNum = Object.keys($scope.followingIds).length;
                    myFollowing($scope.followingIds);
                }
				// if($scope.blogIdList !== null){
				// 	$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				// }
				// $scope.blogArr = [];
				// for(var i in snapshot.val()){
				//     console.log("i",i)
				// 	blogAlgo(i);
				// }

				$ionicLoading.hide();
				$timeout(function () {
				}, 0);
			});
		}
	};

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
			$scope.blogArr.push(single_blog);
		});
		if(callback){
			callback();
		}
	}


	//////////////////// image upload //////////////////////

    $scope.uid = window.localStorage.uid;
    $scope.email = window.localStorage.email;

    var basic;
    $ionicModal.fromTemplateUrl('templates/user/image-crop.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.testData = 'asdsdfb';


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);

            db.ref("users/data/"+$scope.uid).on("value", function(snapshot){
                $ionicLoading.hide();
                console.log(snapshot.val());
                $scope.userDetails = snapshot.val();
            });

            $scope.galleryUpload = function() {
                var options = {
                    destinationType : Camera.DestinationType.FILE_URI,
                    sourceType :	Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
                    allowEdit : false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                };
                $cordovaCamera.getPicture(options).then(function(imageURI) {
                    var image = document.getElementById('profile-pic');
                    // image.src = imageURI;
                    $scope.url = imageURI;
                    cropImage(imageURI);
                    // resizeImage(imageURI);
                }, function(err) {
                    console.log(err);
                });
            };

            $scope.cameraUpload = function() {
                var options = {
                    destinationType : Camera.DestinationType.FILE_URI,
                    sourceType :	Camera.PictureSourceType.CAMERA,
                    allowEdit : false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                };
                $cordovaCamera.getPicture(options).then(function(imageURI) {
                    var image = document.getElementById('profile-pic');
                    image.src = imageURI;
                    $scope.url = imageURI;
                    // alert(JSON.stringify(imageURI)+ 'line number 283, imageURI');
                    cropImage(imageURI);
                    // resizeImage(imageURI);
                }, function(err) {
                    console.log(err);
                });
            };

            $scope.testFunc = function(){
                $scope.modal.show();
            }

            function cropImage(source){
                $scope.modal.show();
                basic = $('.demo').croppie({
                    viewport: {
                        width: 200,
                        height: 200,
                        type: 'circle'
                    }
                });
                basic.croppie('bind', {
                    url: source
                });
            }

            $scope.cropClick = function(){
                $ionicLoading.show({
                    template: 'Loading! Please wait...'
                });
                basic.croppie('result', {
                    type: 'canvas',
                    format: 'jpeg',
                    circle: true
                }).then(function (resp) {
                    $ionicLoading.hide();
                    // alert('test');
                    // alert(JSON.stringify(resp));
                    $http.post("http://139.162.3.205/api/testupload", {path: resp})
                        .success(function(response){
                            // alert("success "+JSON.stringify(response));

                            var updates1 = {};
                            // alert($scope.uid + " " + response.Message);
                            updates1["/users/data/"+$scope.uid+"/photoUrl"] = response.Message;
                            window.localStorage.setItem("userPhoto", response.Message);
                            db.ref().update(updates1).then(function(){
                                // alert("updated in users obj")
                                user.updateProfile({
                                    photoURL: response.Message
                                }).then(function(){
                                    alert("Photo updated successfully");
                                    $scope.modal.hide();
                                });
                            });

                        })
                        .error(function(response){
                            alert('Please try again, something went wrong');
                        });
                });
            }

            function resizeImage(source){
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                img = new Image();
                // alert('img '+ img);
                img.onload = function () {
                    // alert("onload called javascript");
                    canvas.height = canvas.width * (img.height / img.width);
                    /// step 1
                    var oc = document.createElement('canvas');
                    var octx = oc.getContext('2d');
                    oc.width = img.width * 0.5;
                    oc.height = img.height * 0.5;
                    octx.drawImage(img, 0, 0, oc.width, oc.height);
                    /// step 2
                    octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
                    ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, canvas.width, canvas.height);
                    // alert(canvas.width+" "+canvas.height+" "+img.width+" "+img.height);
                    var dataURL = canvas.toDataURL("image/jpeg");
                    // alert('dataURL ' + dataURL);

                    $http.post("http://139.162.3.205/api/testupload", {path: dataURL})
                        .success(function(response){
                            // alert("success "+JSON.stringify(response));

                            var updates1 = {};
                            // alert($scope.uid + " " + response.Message);
                            updates1["/users/data/"+$scope.uid+"/photoUrl"] = response.Message;
                            window.localStorage.setItem("userPhoto", response.Message);
                            db.ref().update(updates1).then(function(){
                                // alert("updated in users obj")
                                user.updateProfile({
                                    photoURL: response.Message
                                }).then(function(){
                                    alert("Photo uploaded successfully");
                                });
                            });

                        })
                        .error(function(response){
                            alert('Plaese try again, something went wrong!');
                        });
                }
                // alert('source '+ source);
                img.src = source;
            }
        }
        else{
            $ionicLoading.hide();
            $location.path("#/login");
        }
    });

});
