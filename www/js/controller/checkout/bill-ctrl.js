app.controller('BillCtrl', function($scope,$ionicLoading,$state){
    $ionicLoading.show();
    $scope.cancelButton = false;


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
    console.log("bookings",hasCurrentBooking);
    if(hasCurrentBooking){
        $scope.bookingInformation = JSON.parse(window.localStorage['currentBooking']);
        var date = setFormat($scope.bookingInformation.appointmentDate);
        var time = '';
        var format = $scope.bookingInformation.appointmentTime.substring($scope.bookingInformation.appointmentTime.length-2, $scope.bookingInformation.appointmentTime.length);
        console.log("time format",format);
        if(format == 'AM'){
            time = $scope.bookingInformation.appointmentTime.substring(0, $scope.bookingInformation.appointmentTime.length-2);
            console.log("time in case of am",time);
        } else {
            var res = $scope.bookingInformation.appointmentTime.split(":");
            var hh = res[0];
            hh = parseInt(hh)+12;
            time= hh+':'+res[1];
            time = time.substring(0, time.length-2);
            console.log("time in case of pm",time);
        }
        $scope.thisBookingTime = toTimestamp(date + ' ' + time);
        console.log("time stamp",$scope.thisBookingTime);
        $scope.vendorId = $scope.bookingInformation.vendorId;
        console.log($scope.vendorId);
        // $ionicLoading.hide();
        db.ref('vendors/'+locationInfo.cityId+'/'+$scope.vendorId).once('value', function(response){
            console.log(response.val());
            // $scope.bookingInformation.venue = response.val().vendorName;
            // $scope.bookingInformation.address1 = response.val().address.address1;
            // $scope.bookingInformation.address2 = response.val().address.address2;
            console.log($scope.bookingInformation);
            $ionicLoading.hide();
        })
    }

    //// To check we, can cancel a booking or not! ///////
    $scope.isActiveCancel = function(){
        if($scope.thisBookingTime>new Date().getTime()){
            $scope.cancelButton = true;
        }
        else{
            $scope.cancelButton = false;
        }
    };

    $scope.isActiveCancel();

    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.availed = function(){
        
    };

    $scope.notAvailed = function(){
        var bookingStatus = {
            status:'notAvailed'
        }
        db.ref('bookings/'+$scope.bookingInformation.bookingId).update(bookingStatus, function(response) {
            console.log("1",response.val())
        })
        db.ref('userBookings/'+localStorage.getItem('uid')+'/active').remove(function(response) {
            console.log("remove",response.val())
        })
        db.ref('userBookings/'+localStorage.getItem('uid')+'/notAvailed/'+$scope.bookingInformation.bookingId).set('true', function(response) {
            console.log("not availed node",response.val())
        })
        db.ref('vendorBookings/'+$scope.bookingInformation.vendorId+'/active').remove(function(response) {
            console.log("remove vem",response.val())
        })
        db.ref('vendorBookings/'+$scope.bookingInformation.vendorId+'/notAvailed/'+$scope.bookingInformation.bookingId).set('true', function(response) {
            console.log("not availed node in vend",response.val())
        })
    };


});