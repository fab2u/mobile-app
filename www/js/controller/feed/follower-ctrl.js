app.controller("followerCtrl", function($scope,$stateParams,$state,$timeout,$ionicLoading){

    $ionicLoading.show();

    var FollowerIds = JSON.parse(window.localStorage['myFollowers']);

    $scope.followerUserDetail = [];

    $scope.goBack = function(){
        $state.go('userFeed',{user_id:$stateParams.uid})
    };
    $timeout(function () {
        $ionicLoading.hide();
    }, 3000);

    var result = {};

    function FollowerDetail(info) {
        angular.forEach(info, function (value, key) {
            db.ref("users/data/" + key).once("value", function (response) {
                result = response.val()
                if (result) {
                    result.postNum = Object.keys(result.blogs).length;
                    $scope.followerUserDetail.push(result);
                }
            })
        })
    }

    if(FollowerIds){
        FollowerDetail(FollowerIds);
    }

    $scope.viewPosts = function (followId) {
        console.log("followId",followId);
        window.localStorage.setItem("follower",true);

        $state.go('followPosts',{followId:followId})
    };
})