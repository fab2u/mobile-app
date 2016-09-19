app.controller('FavouriteCtrl', function($state,$ionicLoading, $scope) {
    $scope.favouriteList = function () {
        $ionicLoading.show();
        if(localStorage.getItem('uid')){
            firebase.database().ref('favourites/'+localStorage.getItem('uid')).once('value',function(response){
                $scope.vendorList = response.val();
                $ionicLoading.hide();
            });
        }
        else{
            alert('Please,login first!');
            $ionicLoading.hide();
        }
    };
    $scope.favouriteList();

    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendor_menu = function(id){
        localStorage.setItem('favourite', true);
        $state.go('vendorMenu',{vendor_id:id});
    };

});