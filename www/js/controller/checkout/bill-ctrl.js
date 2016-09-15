app.controller('BillCtrl', function($scope,$ionicLoading,$state,$ionicModal){
    $ionicLoading.show();
    $scope.cancelButton = false;
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);



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
    $scope.ratingsCallback = function(rating) {
        $scope.custReview.rating = rating;
    };
    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: '#ffd11a',
        iconOffColor: '#b38f00',
        rating: 0,
        minRating: 0,
        readOnly:false,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };



    $scope.custReview ={
        review:'',
        rating: 0
    };
    $ionicModal.fromTemplateUrl('templates/checkout/review.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.rate_vendor = modal;
    });

    $scope.rateVendor = function() {
        $scope.custReview ={
            review:'',
            rating: 0
        }
        $scope.rate_vendor.show();
    };

    $scope.availed = function(){
        $scope.rate_vendor.show();
    };

    $scope.storeReview = function(){
        console.log("review detail",JSON.stringify($scope.custReview));
        if($scope.custReview.rating == 0){
            alert('Please, select ratings!')
        }
        else{
            var updates = {};
            var reviewId = firebase.database().ref('reviews/'+$scope.bookingInformation.cityId+'/'+$scope.bookingInformation.vendorId+'/Reviews').push().key;
            console.log("reviewId",reviewId)
            var reviewData = {
                'ReviewId':reviewId,
                'BookingId':$scope.bookingInformation.bookingId,
                'userId':localStorage.getItem('uid'),
                'ReviewText':$scope.custReview.review,
                'ReviewRating':$scope.custReview.rating,
                'VendorId':$scope.bookingInformation.vendorId,
                'cityName':locationInfo.cityName
            };
            var userReviewData = {
                'VendorId':$scope.bookingInformation.vendorId,
                'cityId':$scope.bookingInformation.cityId,
                'cityName':locationInfo.cityName

            }
            updates['reviews/'+$scope.bookingInformation.cityId+'/'+$scope.bookingInformation.vendorId+'/Reviews/'+reviewData.ReviewId] = reviewData;
            updates['userReviews/'+localStorage.getItem('uid')+'/'+reviewData.ReviewId] = userReviewData;
            updates['bookings/' + $scope.bookingInformation.bookingId + '/' + 'reviewId'] = reviewId;

            db.ref().update(updates).then(function () {
                alert('Your review has been submitted successfully!');
            });
        }
    };

    $scope.review = function() {
        var updates = {};
        updates['bookings/' + $scope.bookingInformation.bookingId + '/' + 'status'] = 'Availed';
        updates['userBookings/' + localStorage.getItem('uid') + '/Availed/' + $scope.bookingInformation.bookingId] = true;
        updates['vendorBookings/' + $scope.bookingInformation.vendorId + '/Availed/' + $scope.bookingInformation.bookingId] = true;
        db.ref().update(updates).then(function () {
            db.ref('userBookings/' + localStorage.getItem('uid') + '/active').remove().then(function () {
                db.ref('vendorBookings/' + $scope.bookingInformation.vendorId + '/active').remove()
            })
            $ionicLoading.hide();
            alert('Your review has been submitted successfully!');
        });
    };

    $scope.notAvailed = function(){
        $ionicLoading.show();
        var updates = {};
        updates['bookings/'+$scope.bookingInformation.bookingId+'/'+'status'] = 'notAvailed';
        updates['userBookings/'+localStorage.getItem('uid')+'/notAvailed/'+$scope.bookingInformation.bookingId] = true;
        updates['vendorBookings/'+$scope.bookingInformation.vendorId+'/notAvailed/'+$scope.bookingInformation.bookingId] = true;
        db.ref().update(updates).then(function(){
        db.ref('userBookings/'+localStorage.getItem('uid')+'/active').remove().then(function() {
            db.ref('vendorBookings/'+$scope.bookingInformation.vendorId+'/active').remove()
        })
            $ionicLoading.hide();
            alert('Thank you for updating your booking status!')
        });
    };


});