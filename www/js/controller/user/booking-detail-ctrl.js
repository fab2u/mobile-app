app.controller('BookingDetailCtrl', function($scope,$state,$ionicLoading,$stateParams){


    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

    $scope.bookingInformation = '';

    console.log("id",$stateParams.bookingId);

    // Booking detail /////

    $scope.bookingDetail = function() {
        $ionicLoading.show();
                firebase.database().ref('bookings/' + $stateParams.bookingId).once('value', function (response) {
                    if (response.val()) {
                        $scope.bookingInformation = response.val();
                        firebase.database().ref('vendors/' + locationInfo.cityId + '/' +response.val().vendorId).once
                        ('value', function (response) {
                            $scope.bookingAddress = response.val();
                            $ionicLoading.hide();
                        });
                    }
                });
        };
    $scope.bookingDetail();

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