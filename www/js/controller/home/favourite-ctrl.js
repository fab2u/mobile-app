app.controller('FavouriteCtrl', function($state,$ionicLoading,$cordovaToast, $scope) {
    function favouriteList() {
        $ionicLoading.show();
        if(localStorage.getItem('uid')){
            firebase.database().ref('favourites/'+localStorage.getItem('uid')).once('value',function(response){
                $scope.vendorList = response.val();
                $ionicLoading.hide();
            });
        }
        else{
            $cordovaToast
                .show('Please,login first!', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
            $ionicLoading.hide();
        }
    };
    favouriteList();

    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendor_menu = function(id){
        localStorage.setItem('favourite', true);
        $state.go('vendorMenu',{vendor_id:id});
    };


    $scope.open_map = function (latitude, longitude, line1, line2, vendorName) {
        $state.go('map', {
            'lat': latitude,
            'lng': longitude,
            'add1': line1,
            'add2': line2,
            'name': vendorName
        });
    };
});