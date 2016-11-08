app.controller("followPostsCtrl", function($scope,$stateParams,$state,$timeout,$ionicLoading,
                                           $location,$ionicPopup,$ionicModal,$sce){

    $ionicLoading.show();

    var myUid = window.localStorage.getItem("uid");
    var followId = $stateParams.followId;
    $scope.uid = window.localStorage.getItem("uid");

    $scope.cityId = JSON.parse(window.localStorage.getItem('selectedLocation')).cityId;


    $scope.goBack = function(){
        $state.go('follow',{uid:myUid})
    };
    $timeout(function () {
        $ionicLoading.hide();
    }, 10000);

    $scope.myBlogIds = [];
    $scope.myFollowingBlogIds = [];
    $scope.followingIds ='';

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


    $scope.createNew = function(){
        $location.path("/new-feed");
    };



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

    db.ref("users/data/"+myUid+"/name").on('value', function(snapshot){
        console.log(snapshot.val());
        $scope.myName = snapshot.val();
    });

    $scope.blogIdList = {};
    $scope.moreMessagesScroll = true;

    if(!myUid){
        showAlert();
    }
    db.ref("users/data/"+followId).on("value", function(snapshot){
        $scope.userDetails = snapshot.val();
        $scope.email = snapshot.val().email.userEmail;
        $scope.userPhoto = snapshot.val().photoUrl;
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

    $scope.likeThisFeed = function(feed){
        if(!$scope.uid){
            showAlertLike();
        }
        else{
            if($("#"+feed.blog_id+"-likeFeed").hasClass('clicked')){
                feed.numLikes -= 1;
                db.ref("blogs/"+feed.blog_id+"/likedBy/"+$scope.uid).remove().then(function(){
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
                updates["blogs/" + feed.blog_id + "/likedBy/" + $scope.uid] = true;
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
    $scope.loadMore = function(){
        console.log('loadmore');
        console.log(Object.keys($scope.blogIdList).length);
        if(Object.keys($scope.blogIdList).length > 0){
            console.log($scope.bottomKey);
            db.ref("users/data/"+followId+"/blogs").orderByKey().limitToFirst(25).endAt($scope.bottomKey).once("value", function(snap){
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
            db.ref("users/data/"+followId +"/blogs").limitToLast(25).once("value", function(snapshot){
                $scope.blogIdList = snapshot.val();
                if($scope.blogIdList !== null){
                    $scope.bottomKey = Object.keys($scope.blogIdList)[0];
                }
                $scope.blogArr = [];
                $scope.blogArr = [];
                for(var i in snapshot.val()){
                    console.log("i",i)
                	blogAlgo(i);
                }

                $ionicLoading.hide();
                $timeout(function () {
                }, 0);
            });
        }
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
    $scope.toTrustedHTML = function( html ){
        return $sce.trustAsHtml( html );
    }
    function blogAlgo(i, callback){
        var blogData = db.ref().child("blogs").child(i);
        blogData.once("value", function(snap){ //access individual blog
            // console.log(snap.val());
            single_blog = snap.val();
            var temp = single_blog.introduction.replace(/\s/g, '');
            single_blog.introduction =  temp.replace(/#(\w+)(?!\w)/g,'<a href="#/tag/$1">#$1</a>');
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
            (function(single_blog){
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
            })(single_blog);
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

            function cropImage(source){
                alert("inside crop image:")
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
                    if($scope.url){
                        cropImage($scope.url);
                    }
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
                    if($scope.url){
                        alert("if image")
                        cropImage($scope.url);
                    }
                    // resizeImage(imageURI);
                }, function(err) {
                    console.log(err);
                });
            };

            $scope.testFunc = function(){
                $scope.modal.show();
            }



            $scope.cropClick = function(){
                $timeout(function () {
                    $ionicLoading.hide();
                }, 400);
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
                            alert("success  uploaded on server"+JSON.stringify(response));

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
                                    $scope.loadMore();
                                });
                            });

                        })
                        .error(function(response){
                            alert('Please try again, something went wrong');
                        });
                });
            }
        }
        else{
            $ionicLoading.hide();
            $location.path("#/login");
        }
    });

})
