app.controller('FavouriteCtrl', function($state,favouriteVendorsService,
                                         $ionicLoading,$cordovaToast, $scope) {
    if(localStorage.getItem('uid')){
        getFavouriteVendor();
    }
    else{
        $cordovaToast
            .show('Please,login first!', 'long', 'center')
            .then(function(success) {
                // success
            }, function (error) {
                // error
            });
    }
    function getFavouriteVendor() {
        $ionicLoading.show();
        favouriteVendorsService.getFavVendors(localStorage.getItem('uid')).then(function(result){
            if(result){
                $scope.vendorList = result;
                $ionicLoading.hide();
            }
            else{
                $scope.vendorList ='';
                $ionicLoading.hide();
            }
        })
    }

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