app.controller("FeedCtrl", function($scope, $timeout, $stateParams, $location, $ionicLoading,
    $ionicModal, userInfoService, $cordovaToast,
    $ionicPopup, $state, $sce, $rootScope, $ionicPopover) {

    if (checkLocalStorage('uid')) {
        $scope.uid = window.localStorage.getItem("uid");
    }
    $rootScope.$on('logged_in', function(event, args) {
        $scope.uid = window.localStorage.getItem('uid');
    });
    $scope.blogLength = 0;
    var count = 0;
    $scope.blogArr = [];
    $scope.moreMessagesScroll = true;
    $scope.moreMessagesRefresh = true;
    $scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;
    $scope.dataLoaded = false;
    $scope.blogIdList = {};

    $scope.goBack = function() {
        $ionicLoading.hide();
        $location.path("/app/home");
    };

    $scope.createNew = function() {
        if ($scope.uid) {
            $ionicLoading.hide();
            $location.path("/new-feed");
        } else {
            showLoginSignUp();
        }
    };

    $timeout(function() {
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

    if ($scope.uid) {
        getUserInfo();
    } else {
        $scope.userName = '';
    }

    function getUserInfo() {
        userInfoService.getPersonalInfo($scope.uid).then(function(result) {
            $scope.userName = result.name;
        })
    }

    $scope.commentToggle = function(feedId) {
        $("#" + feedId + "-commentsBlock").toggle();
    };
    // $scope.$on('$stateChangeSuccess', function() {
    // 	$scope.loadMore();
    // });
    $scope.toTrustedHTML = function(html) {
        return $sce.trustAsHtml(html);
    };
    $scope.loadMore = function() {
        $ionicLoading.show();
        if (Object.keys($scope.blogIdList).length == 0) {
            db.ref("blogs").limitToLast(5).once('value', function(snapshot) {
                if (snapshot.val()) {
                    $scope.blogIdList = snapshot.val();
                    $scope.bottomKey = Object.keys($scope.blogIdList)[0];
                    $scope.topKey = Object.keys($scope.blogIdList)[Object.keys($scope.blogIdList).length - 1];
                    $scope.blogLength = Object.keys($scope.blogIdList).length;
                    for (var key in $scope.blogIdList) {
                        blogAlgo(key);
                    }
                    $scope.dataLoaded = true;
                    $ionicLoading.hide();
                } else {
                    $scope.dataLoaded = true;
                    $ionicLoading.hide();
                    $cordovaToast
                        .show('No feeds available!', 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function(error) {
                            // error
                        });
                }

            })
        } else if (Object.keys($scope.blogIdList).length > 0) {
            db.ref("blogs").orderByKey().limitToFirst(6).endAt($scope.bottomKey)
                .once("value", function(snap) {
                    if (snap.numChildren() == 1) {
                        $ionicLoading.hide();
                        $scope.moreMessagesScroll = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $scope.oldBottomKey = $scope.bottomKey;
                        $scope.bottomKey = Object.keys(snap.val())[0];
                        $scope.blogLength = Object.keys(snap.val()).length - 1;
                        count = 0;
                        for (var key in snap.val()) {
                            if (key != $scope.oldBottomKey) {
                                blogAlgo(key);
                            }
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
        }
    };



    $scope.loadMore();

    function blogAlgo(i) {
        count++;
        var blogData = db.ref().child("blogs").child(i);
        blogData.once("value", function(snap) { //access individual blog
            single_blog = snap.val();
            if (single_blog) {
                if (single_blog.introduction) {
                    var temp = single_blog.introduction;
                    single_blog.introduction = temp.replace(/#(\w+)(?!\w)/g, '<a href="#/tag/$1">#$1</a><span>&nbsp;</span>');
                }
                if (single_blog.comments) {
                    single_blog['commentCount'] = Object.keys(single_blog.comments).length;
                }
                single_blog['commentsArr'] = $.map(single_blog.comments, function(value, index) {
                    return [value];
                });
                if (single_blog.likedBy) {
                    single_blog['numLikes'] = Object.keys(single_blog.likedBy).length;
                }
                single_blog.liked = false;
                checkFollowOrFollowerUser(single_blog, i);
                $scope.blogArr.push(single_blog);
            }
        });
        if (count == $scope.blogLength) {
            $ionicLoading.hide();
            $scope.moreMessagesScroll = true;
        }
    }

    function checkFollowOrFollowerUser(single_blog, i) {
        if (single_blog.user) {
            if ($scope.uid) {
                if (single_blog.user.user_id == $scope.uid) {
                    $timeout(function() {
                        $('.' + single_blog.user.user_id + '-follow').hide();
                    }, 0);
                }
                if (single_blog.likedBy) {
                    if ($scope.uid in single_blog.likedBy) {
                        $timeout(function() {
                            single_blog.liked = true;
                        }, 0);
                    }
                }
                db.ref("users/data/" + single_blog.user.user_id).once("value", function(snap) {
                    if (snap.val().photoUrl) {
                        single_blog.profilePic = snap.val().photoUrl;
                    }
                    if (snap.val().myFollowers) {
                        if ($scope.uid in snap.val().myFollowers) {
                            $timeout(function() {
                                $('.' + single_blog.user.user_id + '-follow').hide();
                                $("." + single_blog.user.user_id + '-unfollow').css("display", "block");
                            }, 0);
                        }
                    }
                });
            } else {
                db.ref("users/data/" + single_blog.user.user_id).once("value", function(snap) {
                    if (snap.val().photoUrl) {
                        single_blog.profilePic = snap.val().photoUrl;
                    }
                })
            }

        }
    }
    $scope.commentPost = function(id) {
        if ($scope.uid) {
            $scope.data = {};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.comment">',
                title: 'Enter your Comment',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' }, {
                        text: '<b>Comment</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.comment) {
                                e.preventDefault();
                            } else {
                                console.log(id);
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
                                db.ref().update(updateComment).then(function() {
                                    var result = $.grep($scope.blogArr, function(e) {
                                        return e.blog_id == id;
                                    });
                                    if (result[0].commentCount == undefined) {
                                        result[0].commentCount = 0;
                                    }
                                    $timeout(function() {
                                        result[0].commentCount += 1;
                                        result[0].commentsArr.push(commentObject_blog);
                                        $("#" + id + "-commentsBlock").show();
                                    }, 0);
                                });
                                return $scope.data.comment;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res, id);
            });
        } else {

            showLoginSignUp()
        }
    };


    $scope.followUser = function(id) {
        $ionicLoading.show();
        if (!$scope.uid) {
            $ionicLoading.hide();
            showLoginSignUp()
        } else {
            var updateFollow = {};
            updateFollow['users/data/' + id + '/myFollowers/' + $scope.uid] = true;
            updateFollow['users/data/' + $scope.uid + '/following/' + id] = true;
            db.ref().update(updateFollow).then(function() {
                $('.' + id + '-follow').hide();
                $("." + id + '-unfollow').css("display", "block");
                $ionicLoading.hide();

                $cordovaToast
                    .show('This user added to your follow list', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function(error) {
                        // error
                    });

                $state.go('feed')
            });
        }
    };

    $scope.unfollowUser = function(id) {
        $ionicLoading.show();
        if (!$scope.uid) {
            $ionicLoading.hide();
            showLoginSignUp()
        } else {
            var updateFollow = {};
            updateFollow['users/data/' + id + '/myFollowers/' + $scope.uid] = null;
            updateFollow['users/data/' + $scope.uid + '/following/' + id] = null;
            db.ref().update(updateFollow).then(function() {
                $('.' + id + '-follow').show();
                $("." + id + '-unfollow').css("display", "none");
                $ionicLoading.hide();

                $cordovaToast
                    .show('This user removed from your follow list', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function(error) {
                        // error
                    });

                $state.go('feed')
            });
        }
    };

    $scope.likeThisFeed = function(feed) {
        $ionicLoading.show();
        if ($scope.uid) {
            if (feed.liked) {
                feed.numLikes -= 1;
                db.ref("blogs/" + feed.blog_id + "/likedBy/" + $scope.uid).remove().then(function() {
                    db.ref("users/data/" + $scope.uid + '/likedBlogs/' + feed.blog_id).remove().then(function() {
                        $timeout(function() {
                            feed.liked = false;

                            $cordovaToast
                                .show('This post removed from your liked list', 'long', 'center')
                                .then(function(success) {
                                    // success
                                }, function(error) {
                                    // error
                                });

                        }, 0);
                    })
                });
            } else {
                if (feed.numLikes == undefined) {
                    feed.numLikes = 0;
                }
                feed.numLikes += 1;
                var updates = {};
                updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.uid] = true;
                updates["users/data/" + $scope.uid + "/likedBlogs/" + feed.blog_id] = true;
                db.ref().update(updates).then(function() {}).then(function() {
                    $timeout(function() {
                        feed.liked = true;

                        $cordovaToast
                            .show('This post added to your liked list', 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function(error) {
                                // error
                            });

                    }, 0);
                });
            }
            db.ref("blogs/" + feed.blog_id + "/likedBy").on("value", function(snap) {
                $ionicLoading.hide();
                feed.numLikes = snap.numChildren();
                $state.go('feed')
            });

        } else {
            $ionicLoading.hide();
            showLoginSignUp()
        }
    };

    function showLoginSignUp() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Not logged in',
            template: 'Please login/sign up to continue'
        });
        confirmPopup.then(function(res) {
            if (res) {
                $ionicLoading.hide();
                $rootScope.from = {
                    stateName: 'feed',
                    params: ''
                }
                $state.go('login')
            } else {
                console.log('You are not sure');
            }
        });
    }

    // dg ionic popver code start
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.demo = 'ios';
    $scope.setPlatform = function(p) {
        document.body.classList.remove('platform-ios');
        document.body.classList.remove('platform-android');
        document.body.classList.add('platform-' + p);
        $scope.demo = p;
    }
    // dg ionic popover code end
});
