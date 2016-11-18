app.controller("userFeedCtrl", function($scope,userInfoService, $timeout,$cordovaCamera,
                                        $http,$state, $location,$ionicModal, $ionicLoading,$sce,
                                        $ionicPopup){

    $scope.myUid = window.localStorage.getItem("uid");
    $scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;
    $scope.blogIdList = {};
    $scope.moreMessagesScroll = true;
    $scope.myBlogIds = [];
    $scope.storedIds = [];
    $scope.followingIds = {};
    $scope.myFollowersDetail = {};
    var blogsNum= 0;
    var blogCount = 0;
    var count = 0;
    var followingNum = 0;
    delete window.localStorage.iFollowingIds;
    delete window.localStorage.myFollowers;

    if($scope.myUid){
        /////////////do all things here

        function getPersonalInfo() {
            userInfoService.getPersonalInfo($scope.myUid).then(function (result) {
                $scope.userDetails = result;
                if($scope.userDetails.following){
                    $scope.following = Object.keys($scope.userDetails.following).length;
                    $scope.followingIds = $scope.userDetails.following;
                }
                if($scope.userDetails.blogs){
                    $scope.numFeeds = Object.keys($scope.userDetails.blogs).length;
                }
                if($scope.userDetails.myFollowers){
                    $scope.followers = Object.keys($scope.userDetails.myFollowers).length;
                    $scope.myFollowersDetail = $scope.userDetails.myFollowers;
                }
                if($scope.userDetails.likedBlogs){
                    $scope.totalLikes = Object.keys($scope.userDetails.likedBlogs).length;
                    $scope.likeBlogIds = $scope.userDetails.likedBlogs;
                }
            })
        }
        getPersonalInfo();



        ////////////////////////////Total posts///////////////////////
        $scope.$on('$stateChangeSuccess', function() {
            getPostInfo();
        });

        function getPostInfo(){
            if(Object.keys($scope.blogIdList).length > 0){
                console.log($scope.bottomKey);
                db.ref("users/data/"+$scope.myUid+"/blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
                    if(snap.numChildren() == 1){
                        $scope.moreMessagesScroll = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    else{
                        $scope.oldBottomKey = $scope.bottomKey;
                        $scope.bottomKey = Object.keys(snap.val())[0];
                        for(var i in snap.val()){
                            if (i != $scope.oldBottomKey){
                               blogAlgo(i);
                            }
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                })
            }
            else if(Object.keys($scope.blogIdList).length == 0){
                db.ref("users/data/"+$scope.myUid +"/blogs").limitToLast(25).once("value", function(snapshot){
                    $scope.blogIdList = snapshot.val();
                    if($scope.blogIdList !== null){
                        $scope.bottomKey = Object.keys($scope.blogIdList)[0];
                    }
                    $scope.blogArr = [];
                    if($scope.following >0){
                        myFollowing($scope.followingIds);
                    }
                    else{
                        for(var key in snapshot.val()){
                            $scope.myBlogIds.push(key);
                             blogAlgo(key);
                        }
                    }
                });
            }
        }
        function myFollowing(followingId){
            for(var id in followingId){
                getBlogIds(id);
            }
        }
        function getBlogIds(id) {
            db.ref("users/data/"+id+"/blogs").once('value', function(snapshot){
                blogsNum += Object.keys(snapshot.val()).length;
                count++;
                for(var blogId in snapshot.val()){
                    blogCount++;
                    $scope.storedIds.push(blogId);
                    if(blogsNum == blogCount && followingNum == count) {
                        allBlogIds($scope.myBlogIds,$scope.storedIds)
                    }
                }
            })
        }
        function allBlogIds(myBlogIds,followingIds) {
            var finalBlogIds = _.union(myBlogIds,followingIds);
            if(finalBlogIds){
                for(var i = 0; i<finalBlogIds.length;i++){
                   blogAlgo(finalBlogIds[i]);
                }
            }
        }

        /////////////////////        posts detail            //////////////////////
        function blogAlgo(i, callback){
            $scope.blogArr = [];
            var blogData = db.ref().child("blogs").child(i);
            blogData.once("value", function(snap){ //access individual blog
                // console.log(snap.val());
                single_blog = snap.val();
                var temp = single_blog.introduction.replace(/\s/g, '');

                single_blog.introduction =  temp.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
                // single_blog.introduction = single_blog.introduction.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
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
                    single_blog['numLikes'] = count;
                    if($scope.myUid in single_blog.likedBy){
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


        ///////////////////////Get post Info function /////////////////


        $scope.postInfo = function(){
            location.reload();
        };


        ///////////////////end Get post Info ///////////////////////
        /////////////////////liked post Info/////////////////////////////////


        $scope.likeFeeds = function(){
            console.log("liked ids :",$scope.likeBlogIds);
            if($scope.totalLikes>0){
                for(key in $scope.likeBlogIds){
                    console.log("key",key)
                   blogAlgo(key);
                }
            }
            else{
                alert('No like found for you!')
            }
        };

        //////////////////////end liked post info///////////////////

        ///////////////////////Get follower count and detail /////////////

        $scope.myFollowers = function(val){
            if(val){
                window.localStorage['myFollowers'] = JSON.stringify($scope.myFollowersDetail);
                $state.go('follower',{uid:$scope.myUid });
            }
            else{
                alert('No followers found!')
            }
        }

        //////////////////////end get follower info //////////////////////

        //////////////////////Get follow info //////////////////////////

        $scope.followDetail = function (val) {
            if(val){
                window.localStorage['iFollowingIds'] = JSON.stringify($scope.followingIds);
                $state.go('follow',{uid:$scope.myUid});
            }
            else{
                alert('No follow found!')
            }
        };
        ///////////////////////end follow detail  ////////////////////////
        //////////////////////////Like a particular feed ////////////////
        $scope.likeThisFeed = function(feed){
                if($("#"+feed.blog_id+"-likeFeed").hasClass('clicked')){
                    feed.numLikes -= 1;
                    db.ref("blogs/"+feed.blog_id+"/likedBy/"+$scope.myUid).remove().then(function(){
                        $("#"+feed.blog_id+"-likeFeed").removeClass("clicked");
                    });
                    console.log("after remove",feed);
                }
                else {
                    if (feed.numLikes == undefined) {
                        feed.numLikes = 0;
                    }
                    feed.numLikes += 1;
                    var updates = {};
                    updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.myUid] = true;
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
        };

        /////////////////////////////end like particular feed///////////////////////////

        /////////////////Comment over particular feed ////////////////////////////////
        $scope.commentPost = function(id) {
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
                                    var commentObject_blog = {
                                        blogId: id,
                                        created_time: new Date().getTime(),
                                        comment: $scope.data.comment,
                                        userId: $scope.myUid,
                                        userName: $scope.userDetails.name
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
        };
        $scope.commentToggle = function(feedId) {
            $("#"+feedId+"-commentsBlock").toggle();
        };
        $scope.goBack = function(){
            $location.path("/app/home");
        };
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        };

        $scope.createNew = function(){
            $location.path("/new-feed");
        };

        //////////////////////////////LoadMore feeds ///////////////////////////////////////

        $scope.loadMore = function(){
            getPostInfo();
        };

        //////////////////////image upload  to user profile//////////////////////////////////

        var basic;
        $ionicModal.fromTemplateUrl('templates/user/image-crop.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.cameraUpload = function() {
            $timeout(function () {
                $ionicLoading.show();
            }, 2000);
            var options = {
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType :	Camera.PictureSourceType.CAMERA,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
            };
            $ionicLoading.hide();
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var image = document.getElementById('profile-pic');
                image.src = imageURI;
                $scope.url = imageURI;
                if($scope.url){
                    cropImage($scope.url);
                }
                else{
                    alert('Please click a pic again!')
                }
            }, function(err) {
                console.log(err);
            });
        };

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
            $ionicLoading.show();
            basic.croppie('result', {
                type: 'canvas',
                format: 'jpeg',
                circle: true
            }).then(function (resp) {
                $ionicLoading.hide();
                $http.post("http://139.162.3.205/api/testupload", {path: resp})
                    .success(function(response){
                        var updates1 = {};
                        updates1["/users/data/"+$scope.myUid+"/photoUrl"] = response.Message;
                        window.localStorage.setItem("userPhoto", response.Message);
                        db.ref().update(updates1).then(function(){
                            user.updateProfile({
                                photoURL: response.Message
                            }).then(function(){
                                $ionicLoading.hide();
                                alert("Photo updated successfully");
                                $scope.modal.hide();
                            });
                        });

                    })
                    .error(function(response){
                        $ionicLoading.hide();
                        alert('Please try again, something went wrong');
                    });
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 4000);
        };
        $scope.galleryUpload = function() {
            $timeout(function () {
                $ionicLoading.show();
            }, 2000);
            var options = {
                destinationType : Camera.DestinationType.FILE_URI,
                sourceType :	Camera.PictureSourceType.PHOTOLIBRARY, //, Camera.PictureSourceType.CAMERA,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
            };
            $ionicLoading.hide()
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var image = document.getElementById('profile-pic');
                $scope.url = imageURI;
                if($scope.url){
                    cropImage($scope.url);
                }
                else{
                    alert('Please take another picture!')
                }
            }, function(err) {
                console.log(err);
            });
        };

    }
    else{
        alert('Please login/SignUp with fabbook.')
    }
});
