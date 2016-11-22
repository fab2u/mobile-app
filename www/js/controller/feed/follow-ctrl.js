app.controller("followCtrl", function(userServices,$scope,$stateParams,$state,$timeout,$ionicLoading){

    var FollowIds = JSON.parse(window.localStorage['iFollowingIds']);
    $scope.IfollowingUserDetail = [];
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
        $ionicLoading.hide();

    }

    $scope.viewPosts = function (followId) {
        $state.go('followPosts',{followId:followId})
    };
    $scope.goBack = function(){
        $state.go('userFeed',{user_id:$stateParams.uid})
    };
})