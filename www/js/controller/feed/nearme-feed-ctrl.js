app.controller("nearmeFeedCtrl", function ($scope, $timeout, $stateParams, $location, $ionicLoading,
                                           $ionicModal,userInfoService, $ionicPopup, $state,
                                           $sce,$cordovaToast) {

    $ionicLoading.show();
    $scope.blogLength = 0;
    $scope.uid = window.localStorage.getItem("uid");
    $scope.moreMessagesScroll = true;
    $scope.moreMessagesRefresh = true;
    $scope.cityId = $stateParams.cityId;
    $scope.blogIdList = {};
    var count = 0;

    $timeout(function () {
        $ionicLoading.hide();
    }, 10000);

    // ----------------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/feed/image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    $scope.showImage = function (source) {
        $scope.imageSrc = source;
        $scope.openModal();
    }
    // ----------------------------------------------------------------------
    if($scope.uid){
        myInfo();
    }
    else{
        $scope.userName = '';
    }

    function myInfo() {
        userInfoService.getPersonalInfo($scope.uid).then(function (result) {
            $scope.userName = result.name;
        })
    }
    $scope.commentToggle = function (feedId) {
        $("#" + feedId + "-commentsBlock").toggle();
    };

    $scope.toTrustedHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadMore();
    });

    $scope.loadMore = function () {
        $ionicLoading.show();
        if (Object.keys($scope.blogIdList).length > 0) {
            db.ref("cityBlogs/" + $scope.cityId + "/blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function (snap) {
                if (snap.numChildren() == 1) {
                    $scope.moreMessagesScroll = false;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.oldBottomKey = $scope.bottomKey;
                    $scope.bottomKey = Object.keys(snap.val())[0];
                    $scope.blogLength = Object.keys(snap.val()).length;

                    for (var i in snap.val()) {
                        // console.log(i); // i is the key of blogs object or the id of each blog
                        if (i != $scope.oldBottomKey) {
                            blogAlgo(i);
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        }
        else if (Object.keys($scope.blogIdList).length == 0) {
            db.ref("cityBlogs/" + $scope.cityId + "/blogs").limitToLast(25).once('value', function (snapshot) {
                $ionicLoading.hide();
                $scope.blogIdList = snapshot.val();
                $scope.bottomKey = Object.keys($scope.blogIdList)[0];
                $scope.topKey = Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1];
                $scope.blogArr = [];
                $scope.blogLength = Object.keys($scope.blogIdList).length;
                for (var i in $scope.blogIdList) {
                    // console.log(i); // i is the key of blogs object or the id of each blog
                    blogAlgo(i);
                }
                $timeout(function () {
                }, 0);
            })
        }
    }

    function blogAlgo(i, callback) {
        count++;
        var blogData = db.ref().child("blogs").child(i);
        blogData.once("value", function (snap) { //access individual blog
            single_blog = snap.val();
            if(single_blog){
                if(single_blog.introduction){
                    var temp = single_blog.introduction.replace(/\s/g, '');
                    single_blog.introduction = temp.replace(/#(\w+)(?!\w)/g, '<a href="#/tag/$1">#$1</a>');
                }
                // start: comment system code
                if (single_blog.comments) {
                    single_blog['commentCount'] = Object.keys(single_blog.comments).length;
                }
                // start convert comments object to array
                single_blog['commentsArr'] = $.map(single_blog.comments, function (value, index) {
                    return [value];
                });
                // end convert comments object to array
                // end: comment system code

                // If you want to run asynchronous functions inside a loop, but still want to keep the index or other variables after a callback gets executed you can wrap your code in an IIFE (immediately-invoked function expression).
                (function (single_blog) {
                    if(single_blog.user){
                        if (single_blog.user.user_id == $scope.uid) {
                            $timeout(function () {
                                $('.' + single_blog.user.user_id + '-follow').hide();
                            }, 0);
                        }
                        db.ref("users/data/" + single_blog.user.user_id).once("value", function (snap) {
                            // console.log(single_blog.user.user_id, snap.val());
                            if (snap.val().photoUrl) {
                                single_blog.profilePic = snap.val().photoUrl;
                            }
                            if (snap.val().myFollowers) {
                                // console.log(snap.val().myFollowers);
                                if ($scope.uid in snap.val().myFollowers) {
                                    $timeout(function () {
                                        $('.' + single_blog.user.user_id + '-follow').hide();
                                        $("." + single_blog.user.user_id + '-unfollow').css("display", "block");
                                    }, 0);
                                }
                            }
                        });
                    }
                })(single_blog);
                if (single_blog.likedBy) {
                    var count1 = Object.keys(single_blog.likedBy).length;
                    single_blog['numLikes'] = count1;
                    if ($scope.uid in single_blog.likedBy) {
                        $timeout(function () {
                            $("#" + i + "-likeFeed").addClass("clicked");
                        }, 1000);
                    }
                }
                $scope.blogArr.push(single_blog);
            }

        });
        if (callback) {
            callback();
        }
        if (count == $scope.blogLength) {
            $scope.moreMessagesScroll = true;
            $ionicLoading.hide();
        }
    }

    $scope.doRefresh = function () {
        db.ref("cityBlogs/" + $scope.cityId + "/blogs").orderByKey().startAt($scope.topKey).once("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.numChildren() == 1) {
                console.log('one child');
                $scope.moreMessagesRefresh = false;
            }
            else {
                console.log(snapshot.val());
                $scope.prevTopKey = $scope.topKey;
                $scope.topKey = Object.keys(snapshot.val())[Object.keys(snapshot.val()).length - 1];
                var single_blog = {};
                for (var i in snapshot.val()) {
                    // console.log(i); // i is the key of blogs object or the id of each blog
                    if (i != $scope.prevTopKey) {
                        blogAlgo(i);
                    }
                }
            }
            $scope.$broadcast('scroll.refreshComplete');
        })
    };

    $scope.commentPost = function (id) {
        if($scope.uid) {
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
                                    userId: $scope.uid,
                                    userName: $scope.userName
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
            $cordovaToast
                .show('Please login/SignUp for comment this post.', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
    };

    $scope.followUser = function (id) {
        $ionicLoading.show();
        if (!$scope.uid) {
            $ionicLoading.hide();
            $cordovaToast
                .show('Please login/SignUp to follow the user.', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
        else {
            var updateFollow = {};
            updateFollow['users/data/' + id + '/myFollowers/' + $scope.uid] = true;
            updateFollow['users/data/' + $scope.uid + '/following/' + id] = true;
            db.ref().update(updateFollow).then(function () {
                $('.' + id + '-follow').hide();
                $("." + id + '-unfollow').css("display", "block");
                $ionicLoading.hide();
                $state.go('nearmeFeed', {cityId: $stateParams.cityId})

            });
        }
    }

    $scope.unfollowUser = function (id) {
        $ionicLoading.show();
        if (!$scope.uid) {
            $ionicLoading.hide();
            $cordovaToast
                .show('Please login/SignUp to unfollow the user.', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
        else {
            var updateFollow = {};
            updateFollow['users/data/' + id + '/myFollowers/' + $scope.uid] = null;
            updateFollow['users/data/' + $scope.uid + '/following/' + id] = null;
            db.ref().update(updateFollow).then(function () {
                $('.' + id + '-follow').show();
                $("." + id + '-unfollow').css("display", "none");
                $ionicLoading.hide();
                $state.go('nearmeFeed', {cityId: $stateParams.cityId})
            });
        }
    }

    $scope.likeThisFeed = function (feed) {
        $ionicLoading.show();
        if($scope.uid) {
            if ($("#" + feed.blog_id + "-likeFeed").hasClass('clicked')) {
                feed.numLikes -= 1;
                db.ref("blogs/" + feed.blog_id + "/likedBy/" + $scope.uid).remove().then(function () {
                    $("#" + feed.blog_id + "-likeFeed").removeClass("clicked");
                });
            }
            else {
                if (feed.numLikes == undefined) {
                    feed.numLikes = 0;
                }
                feed.numLikes += 1;
                var updates = {};
                updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.uid] = true;
                db.ref().update(updates).then(function () {
                    $("#" + feed.blog_id + "-likeFeed").addClass("clicked");
                });
            }
            db.ref("blogs/" + feed.blog_id + "/likedBy").on("value", function (snap) {
                $ionicLoading.hide();
                feed.numLikes = snap.numChildren();
            });
        }
        else{
            $ionicLoading.hide();
            $cordovaToast
                .show('Please login/SignUp to like this post.', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
    }

    $scope.goBack = function () {
        $location.path("/app/home");
    };

    $scope.createNew = function () {
        $location.path("/new-feed");
    };

});

