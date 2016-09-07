app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', '$ionicLoading', '$cordovaCamera', function($scope, $timeout, $stateParams, $ionicLoading, $cordovaCamera){

	$ionicLoading.show();

	$scope.goBack = function(){
		history.back();
	}

	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);

	$scope.uid = $stateParams.user_id;
	$scope.email = window.localStorage.email;
	$scope.userPhoto = window.localStorage.userPhoto;
	// $scope.img_hash = md5($scope.uid);
	// jdenticon.update("#identicon", $scope.img_hash);
	var uid = window.localStorage.uid;
	$scope.blogIdList = {};
	$scope.moreMessagesScroll = true;


	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			console.log(user);

			db.ref("users/data/"+uid).on("value", function(snapshot){
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
					var image = document.getElementById('myImage');
					image.src = imageURI;
					$scope.url = imageURI;

					resizeImage(imageURI);

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
					var image = document.getElementById('myImage');
					image.src = imageURI;
					$scope.url = imageURI;
					alert(JSON.stringify(imageURI)+ 'line number 283, imageURI');

					resizeImage(imageURI);

				}, function(err) {
					console.log(err);
				});
			};

			function resizeImage(source){
				alert('resizeImage called')
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");

				img = new Image();
				alert('img '+ img);
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
					alert('dataURL ' + dataURL);

					$http.post("http://139.162.3.205/api/testupload", {path: dataURL})
					.success(function(response){
						alert("success "+JSON.stringify(response));

						var updates1 = {};
						alert($scope.uid + " " + response.Message);
						updates1["users/data/"+$scope.uid+"/photoUrl"] = response.Message;
						window.localStorage.setItem("userPhoto", response.Message);
						db.ref().update(updates1).then(function(){
							user.updateProfile({
								photoURL: response.Message
							}).then(function(){
								alert("photo updated in firebase object");
							});
						});

					})
					.error(function(response){
						alert(JSON.stringify(response));
					});
				}
				alert('source '+ source);
				img.src = source;
			}
		}
		else{
			$ionicLoading.hide();
			$location.path("#/login");
		}
	});

	$scope.likeThisFeed = function(feedId){
		if($("#"+feedId+"-likeFeed").hasClass('clicked')){
			console.log('inside remove');
			var result = $.grep($scope.blogArr, function(e){ return e.blog_id == feedId; });
			console.log(result);
			result[0].numLikes -= 1;
			db.ref("blogs/"+feedId+"/likedBy/"+$scope.uid).remove().then(function(){
				console.log('removed successfully');
				$("#"+feedId+"-likeFeed").removeClass("clicked");
			});
		}
		else {
			console.log(feedId, $scope.uid);
			var result = $.grep($scope.blogArr, function(e){ return e.blog_id == feedId; });
			console.log(result);
			result[0].numLikes += 1;
			var updates = {};
			updates["blogs/"+feedId+"/likedBy/"+$scope.uid] = true;
			db.ref().update(updates).then(function(){
				console.log('success');
				$("#"+feedId+"-likeFeed").addClass("clicked");
			});
		}
		db.ref("blogs/"+feedId+"/likedBy").on("value", function(snap){
			console.log(snap.numChildren());
		});
	}

	$scope.loadMore = function(){
		console.log('loadmore');
		console.log(Object.keys($scope.blogIdList).length);
		if(Object.keys($scope.blogIdList).length > 0){
			console.log($scope.bottomKey);
			db.ref("users/data/"+uid+"/blogs").orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
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
							var blogData = db.ref().child("blogs").child(i);
							blogData.once("value", function(snap){ //access individual blog
								// console.log(snap.val());
								single_blog = snap.val();
								single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
								single_blog.profilePic = $scope.userPhoto;
								// $timeout(function () {
								// 	jdenticon.update("#"+single_blog.blog_id, md5(single_blog.user.user_id));
								// }, 0);
								if(single_blog.likedBy){
									count = Object.keys(single_blog.likedBy).length;
									console.log(single_blog.likedBy);
									console.log(count);
									single_blog['numLikes'] = count;
									if($scope.uid in single_blog.likedBy){
										$timeout(function () {
											$("#"+i+"-likeFeed").addClass("clicked");
										}, 0);
									}
								}
								console.log($scope.blogArr);
								$scope.blogArr.push(single_blog);
							});
						}
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		}
		else if(Object.keys($scope.blogIdList).length == 0){
			db.ref("users/data/"+uid +"/blogs").limitToLast(5).once("value", function(snapshot){
				$scope.blogIdList = snapshot.val();
				$scope.bottomKey = Object.keys($scope.blogIdList)[0];
				$scope.blogArr = [];
				for(var i in snapshot.val()){
					var blogData = db.ref("blogs/" + i);
					blogData.once("value", function(snap){
						single_blog = snap.val();
						single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
						single_blog.profilePic = $scope.userPhoto;
						// $timeout(function () {
						// 	jdenticon.update("#"+single_blog.blog_id, md5(single_blog.user.user_id));
						// }, 0);
						if(single_blog.likedBy){
							count = Object.keys(single_blog.likedBy).length;
							console.log(single_blog.likedBy);
							console.log(count);
							single_blog['numLikes'] = count;
							if($scope.uid in single_blog.likedBy){
								$timeout(function () {
									$("#"+i+"-likeFeed").addClass("clicked");
								}, 0);
							}
						}
						$scope.blogArr.push(single_blog);
					});
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

}]);
