app.controller("followPostsCtrl", function(userInfoService,$scope,$stateParams,$state,$timeout,
                                           $ionicLoading,$location,$ionicPopup,$cordovaToast,
                                           $ionicModal,$sce){

    if(checkLocalStorage('uid')){
        $scope.myUid = window.localStorage.getItem("uid");
    }
    var followId = $stateParams.followId;
    $scope.uid = window.localStorage.getItem("uid");
    $scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;
    $scope.blogIdList = {};
    $scope.moreMessagesScroll = true;
    $scope.blogArr = [];
    var count = 0;
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

    if($scope.myUid){
        myInfo();
    }
    if(followId){
        followOrFollowerDetail();
    }
    else{
        showLoginSignUp()
    }

    function myInfo() {
        userInfoService.getPersonalInfo($scope.myUid).then(function (result) {
            $scope.myName = result.name;
        })
    }
    function followOrFollowerDetail() {
        userInfoService.getPersonalInfo(followId).then(function (result) {
            $scope.userDetails = result;
            $scope.email = result.email.userEmail;
            $scope.userPhoto = result.photoUrl;
        })
    }

    $scope.commentToggle = function(feedId) {
        $("#"+feedId+"-commentsBlock").toggle();
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

    $scope.loadMore = function(){
        $ionicLoading.show()
        if(Object.keys($scope.blogIdList).length > 0){
            db.ref("users/data/"+followId+"/blogs").orderByKey().limitToFirst(5).endAt($scope.bottomKey).once("value", function(snap){
                if(snap.numChildren() == 1){
                    $scope.moreMessagesScroll = false;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else{
                    $scope.oldBottomKey = $scope.bottomKey;
                    $scope.bottomKey = Object.keys(snap.val())[0];
                    $scope.blogLength = Object.keys(snap.val()).length;
                    count = 0;
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
            db.ref("users/data/"+followId +"/blogs").limitToLast(5).once("value", function(snapshot){
                $scope.blogIdList = snapshot.val();
                if($scope.blogIdList !== null){
                    $scope.bottomKey = Object.keys($scope.blogIdList)[0];
                }
                $scope.blogLength = Object.keys($scope.blogIdList).length;
                for(var i in $scope.blogIdList){
                	blogAlgo(i);
                }
                $ionicLoading.hide();
            });
        }
    };

    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    };
    function blogAlgo(i){
        count++;
        var blogData = db.ref().child("blogs").child(i);
        blogData.once("value", function(snap){ //access individual blog
           single_blog = snap.val();
            if(single_blog){
                single_blog.profilePic = $scope.userPhoto;
                if(single_blog.introduction){
                    var temp = single_blog.introduction.replace(/\s/g, '');
                    single_blog.introduction =  temp.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
                }
                if(single_blog.comments){
                    single_blog['commentCount'] = Object.keys(single_blog.comments).length;
                }
                single_blog['commentsArr'] = $.map(single_blog.comments, function(value, index) {
                    return [value];
                });
                (function(single_blog){
                    if(single_blog.user.user_id == $scope.myUid){
                        $timeout(function () {
                            $('.'+single_blog.user.user_id+'-follow').hide();
                        }, 0);
                    }
                    db.ref("users/data/"+single_blog.user.user_id).once("value", function(snap){
                        if(snap.val().photoUrl){
                            single_blog.profilePic = snap.val().photoUrl;
                        }
                        if(snap.val().myFollowers){
                            if ($scope.myUid in snap.val().myFollowers){
                                $timeout(function () {
                                    $('.'+single_blog.user.user_id+'-follow').hide();
                                    $("."+single_blog.user.user_id+'-unfollow').css("display", "block");
                                }, 0);
                            }
                        }
                    });
                })(single_blog);
                if(single_blog.likedBy){
                    var count11 = Object.keys(single_blog.likedBy).length;
                    single_blog['numLikes'] = count11;
                    if($scope.myUid in single_blog.likedBy){
                        $timeout(function () {
                            $("#"+i+"-likeFeed").addClass("clicked");
                        }, 1000);
                    }
                }
                $scope.blogArr.push(single_blog);
            }
        })
        if(count == $scope.blogLength){
            $ionicLoading.hide();
            $scope.moreMessagesScroll = true;
        }
    }

    $scope.commentPost = function(id) {
        if($scope.myUid){
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
                                var newCommentKey = db.ref().push().key;
                                var commentObject_blog = {
                                    blogId: id,
                                    created_time: new Date().getTime(),
                                    comment: $scope.data.comment,
                                    userId: $scope.myUid,
                                    userName: $scope.myName
                                };
                                var updateComment = {};
                                updateComment['blogs/' + id + '/comments/' + newCommentKey] = commentObject_blog;
                                db.ref().update(updateComment).then(function () {
                                    // start: adding comment to particular feed
                                    var result = $.grep($scope.blogArr, function (e) {
                                        return e.blog_id == id;
                                    });
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
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res, id);
            });
        }
        else{
            showLoginSignUp()
        }
    };

    $scope.likeThisFeed = function(feed){
        $ionicLoading.show()
        if($scope.myUid){
            if($("#"+feed.blog_id+"-likeFeed").hasClass('clicked')){
                feed.numLikes -= 1;
                db.ref("blogs/"+feed.blog_id+"/likedBy/"+$scope.myUid).remove().then(function(){
                    $("#"+feed.blog_id+"-likeFeed").removeClass("clicked");
                });
            }
            else {
                if (feed.numLikes == undefined) {
                    feed.numLikes = 0;
                }
                feed.numLikes += 1;
                var updates = {};
                updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.myUid] = true;
                db.ref().update(updates).then(function () {
                    $("#" + feed.blog_id + "-likeFeed").addClass("clicked");
                });
            }
            db.ref("blogs/"+feed.blog_id+"/likedBy").on("value", function(snap){
                feed.numLikes = snap.numChildren();
                $ionicLoading.hide()
            });

        }
        else{
            $ionicLoading.hide()
            showLoginSignUp()
        }
    }

    $scope.followUser = function(id) {
        $ionicLoading.show()
        if (!$scope.myUid) {
            $ionicLoading.hide()
            showLoginSignUp()
        }
        else {
            var updateFollow = {};
            updateFollow['users/data/' + id + '/myFollowers/' + $scope.myUid] = true;
            updateFollow['users/data/' + $scope.uid + '/following/' + id] = true;
            db.ref().update(updateFollow).then(function () {
                $('.' + id + '-follow').hide();
                $("."+id+'-unfollow').css("display", "block");
                $ionicLoading.hide()
                $state.go('feed')
            });
        }
    };

    $scope.unfollowUser = function(id){
        $ionicLoading.show()
        if(!$scope.myUid){
            $ionicLoading.hide()
            showLoginSignUp()
        }
        else{
            var updateFollow = {};
            updateFollow['users/data/'+id+'/myFollowers/'+$scope.myUid] = null;
            updateFollow['users/data/'+$scope.uid+'/following/'+id] = null;
            db.ref().update(updateFollow).then(function(){
                $('.'+id+'-follow').show();
                $("."+id+'-unfollow').css("display", "none");
                $ionicLoading.hide()
                $state.go('feed')
            });
        }
    };
    function showLoginSignUp() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Not logged in',
            template: 'Please login/sign up to continue'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $state.go('login')
            } else {
                console.log('You are not sure');
            }
        });
    }
    $scope.goBack = function(){
        if(window.localStorage.getItem("follower")=='true') {
            $state.go('follower', {uid: $scope.myUid});
        }
        else{
            $state.go('follow',{uid:$scope.myUid})
        }
    };

    $scope.createNew = function(){
        $location.path("/new-feed");
    };

})
