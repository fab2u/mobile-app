app.controller("followCtrl", function(userServices,$scope,$stateParams,$state,$timeout,$ionicLoading){

    var FollowIds = JSON.parse(window.localStorage['iFollowingIds']);
    $scope.IfollowingUserDetail = [];
    delete window.localStorage.follower;
    $scope.msg = false;

    $timeout(function () {
        $ionicLoading.hide();
    }, 5000);

    if(FollowIds){
        iFollowingDetail(FollowIds);
    }
    else{
        $scope.msg = true;
    }
    function iFollowingDetail(info) {
        $ionicLoading.show();
        for(key in info){
            userServices.getUserInfo(key).then(function (result) {
                    result.postNum = Object.keys(result.blogs).length;
                    $scope.IfollowingUserDetail.push(result);
            })
        }
        $timeout(function () {
            $ionicLoading.hide();
        }, 1500);
    }

    $scope.viewPosts = function (followId) {
        $ionicLoading.hide();
        $state.go('followPosts',{followId:followId})
    };
    $scope.goBack = function(){
        $ionicLoading.hide();
        $state.go('userFeed',{user_id:$stateParams.uid})
    };
})