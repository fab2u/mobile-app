app.controller('BillCtrl', function($scope,$ionicLoading,$state){
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

    $scope.bookingInfo = function() {
        $ionicLoading.show();
        firebase.database().ref('userBookings/'+localStorage.getItem('uid')+'/active').once	('value',function(response) {
            angular.forEach(response.val(), function (value, key) {
                var currentBookingId =value.bookingId;
                if(currentBookingId){
                    firebase.database().ref('bookings/'+currentBookingId).once('value', function (response) {
                        console.log(response.val())
                            $scope.bookingInformation = response.val();
                            if ($scope.bookingInformation) {
                                $ionicLoading.hide();
                            }
                            else if (!$scope.bookingInformation) {
                                $ionicLoading.hide();
                            }
                    });
                    firebase.database().ref('vendors/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")).once('value',function(response){
                        $scope.bookingAddress = response.val().address
                    });
                }
            })
        })
    };
    $scope.bookingInfo();

    $scope.home = function(){
        $state.go('app.home')
    }

});