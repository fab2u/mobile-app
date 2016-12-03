app.controller("followerCtrl", function(userServices,$scope,$stateParams,$state,$timeout,$ionicLoading){

    $ionicLoading.show();

    var FollowerIds = JSON.parse(window.localStorage['myFollowers']);
    $scope.followerUserDetail = [];
    $scope.msg = false;
    $timeout(function () {
        $ionicLoading.hide();
    }, 5000);

    if(FollowerIds){
        FollowerDetail(FollowerIds);
    }
    else{
        $scope.msg = true;
    }
    function FollowerDetail(info) {
        $ionicLoading.show();
        for(key in info){
            userServices.getUserInfo(key).then(function (result) {
                $ionicLoading.hide();
                result.postNum = Object.keys(result.blogs).length;
                $scope.followerUserDetail.push(result);
            })
        }
        $timeout(function () {
            $ionicLoading.hide();
        }, 1500);
    }

    $scope.viewPosts = function (followId) {
        window.localStorage.setItem("follower",true);
        $ionicLoading.hide();
        $state.go('followPosts',{followId:followId})
    };
    $scope.goBack = function(){
        $ionicLoading.hide();
        $state.go('userFeed',{user_id:$stateParams.uid})
    };
})