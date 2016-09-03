app.controller('BillCtrl', function($scope,$ionicLoading,$state){
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

$scope.bookingInfo = function() {
    $ionicLoading.show();
    firebase.database().ref('bookings/').once('value', function (response) {
        angular.forEach(response.val(), function (value, key) {
            $scope.bookingId = key;
            $scope.bookingInformation = value
            if ($scope.bookingInformation) {
                $ionicLoading.hide();
            }
            else if (!$scope.bookingInformation) {
                $ionicLoading.hide();
            }
        })
        if(response.val()){
            firebase.database().ref('vendors/'+locationInfo.cityId+'/'+window.localStorage.getItem("vendorId")).once('value',function(response){
               $scope.bookingAddress = response.val().address
            });
        }
    });
};
$scope.bookingInfo();

    $scope.home = function(){
        $state.go('app.home')
    }

});