app.controller('BookingDetailCtrl', function($scope,$state,$ionicLoading,$stateParams,$timeout){


    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

    $scope.bookingInformation = '';
    $scope.bookingAddress = '';

    $scope.show = function() {
        $ionicLoading.show();
    };
    $scope.show();
    $timeout(function () {
        $ionicLoading.hide();
    }, 10000);

    // Booking detail /////

     function bookingDetail() {
        $ionicLoading.show();
                firebase.database().ref('bookings/' + $stateParams.bookingId).once('value', function (response) {
                    if (response.val()) {
                        $scope.bookingInformation = response.val();
                        firebase.database().ref('vendors/' + locationInfo.cityId + '/vendors/' +response.val().vendorId).once
                        ('value', function (response) {
                            if(response.val()){
                                $scope.bookingAddress = response.val();
                                $ionicLoading.hide();
                            }
                          else{
                                $ionicLoading.hide();
                            }
                        });
                    }
                    else{
                        $ionicLoading.hide();
                    }
                });
        };
     bookingDetail();

    $scope.back = function () {
        $state.go('bookings');
    };

    //////////////Map for vendor location  ////////////////////////////////
    $scope.open_map = function(latitude,longitude,line1,line2,vendorName){
        $state.go('map',{
            'lat': latitude,
            'lng': longitude,
            'add1': line1,
            'add2': line2,
            'name': vendorName
        });
    };


});