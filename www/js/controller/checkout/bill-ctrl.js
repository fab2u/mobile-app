app.controller('BillCtrl', function($scope,$ionicLoading,$state){
    $ionicLoading.show();

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum;
    }

    function setFormat(str){
        var mystring = str;  
        var newchar = '-'
        mystring = mystring.split('/').join(newchar);
        return mystring;
    }

    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
    var hasCurrentBooking = checkLocalStorage('currentBooking');
    console.log(hasCurrentBooking);
    if(hasCurrentBooking){
        $scope.bookingInformation = JSON.parse(window.localStorage['currentBooking']);
        var date = setFormat($scope.bookingInformation.appointmentDate);
        var time = '';
        var format = $scope.bookingInformation.appointmentTime.substring($scope.bookingInformation.appointmentTime.length-2, $scope.bookingInformation.appointmentTime.length);
        console.log(format);
        if(format == 'AM'){
            time = $scope.bookingInformation.appointmentTime.substring(0, $scope.bookingInformation.appointmentTime.length-2);
            console.log(time);
        } else {
            var res = $scope.bookingInformation.appointmentTime.split(":");
            var hh = res[0];
            hh = parseInt(hh)+12;
            time= hh+':'+res[1];
            time = time.substring(0, time.length-2);
            console.log(time);
        }
        var thisBookingTime = toTimestamp(date + ' ' + time);
        console.log(thisBookingTime);
        $scope.vendorId = $scope.bookingInformation.vendorId;
        console.log($scope.vendorId);
        // $ionicLoading.hide();
        db.ref('vendors/'+locationInfo.cityId+'/'+$scope.vendorId).once('value', function(response){
            console.log(response.val());
            $scope.bookingInformation.venue = response.val().vendorName;
            $scope.bookingInformation.address1 = response.val().address.address1;
            $scope.bookingInformation.address2 = response.val().address.address2;
            console.log($scope.bookingInformation);
            $ionicLoading.hide();
        })
    }
    $scope.home = function(){
        $state.go('app.home')
    }

});