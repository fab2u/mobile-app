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
                            $scope.bookingAddress = response.val()
                            $ionicLoading.hide();
                        });
                    }
                });
        };
    $scope.bookingDetail();

    $scope.back = function () {
        $state.go('bookings');
    };


});