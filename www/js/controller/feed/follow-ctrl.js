app.controller("followCtrl", function($scope,$stateParams,$state,$timeout,$ionicLoading){

    $ionicLoading.show();

    var FollowIds = JSON.parse(window.localStorage['iFollowingIds']);
    $scope.IfollowingUserDetail = [];

    $scope.goBack = function(){
       $state.go('userFeed',{user_id:$stateParams.uid})
    };
    $timeout(function () {
        $ionicLoading.hide();
    }, 3000);

    function iFollowingDetail(info) {
        angular.forEach(info, function (value, key) {
            db.ref("users/data/" + key).once("value", function (response) {
                if (response.val()) {
                    $scope.IfollowingUserDetail.push(response.val());
                }
            })
        })
    }

    if(FollowIds){
        iFollowingDetail(FollowIds);
    }

    $scope.viewPosts = function (followId) {
     console.log("followId",followId);
        $state.go('followPosts',{followId:followId})
    };
})