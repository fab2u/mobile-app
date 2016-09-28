app.controller('BillCtrl', function($scope,$ionicLoading,$state,$ionicModal,$rootScope){
    $ionicLoading.show();
    $scope.cancelButton = false;
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
    $scope.vendorAddress = '';
    $scope.bookingInformation = {};


    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
    var hasCurrentBooking = checkLocalStorage('currentBooking');
    if(hasCurrentBooking){
        $scope.bookingInformation = JSON.parse(window.localStorage['currentBooking']);
        $scope.vendorId = $scope.bookingInformation.vendorId;
        // $ionicLoading.hide();
        db.ref('vendors/'+locationInfo.cityId+'/'+$scope.vendorId).once('value', function(response){
            if(response.val()){
                $scope.bookingInformation.venue = response.val().vendorName;
                $scope.bookingInformation.address1 = response.val().address.address1;
                $scope.bookingInformation.address2 = response.val().address.address2;
                $scope.bookingInformation.vendorLat = response.val().address.latitude;
                $scope.bookingInformation.vendorLong = response.val().address.longitude;
                $scope.bookingInformation.vendorName = response.val().contactDetails.name;
                $scope.vendorAddress = response.val();
                $ionicLoading.hide();
            }
            else{
                $ionicLoading.hide();
            }
        })
        $scope.cancelButton = true;
        //// To check we, can cancel a booking or not! ///////
        // $scope.isActiveCancel = function(){
        //     if($scope.bookingInformation.appointmentTime>new Date().getTime()){
        //         $scope.cancelButton = true;
        //     }
        //     else{
        //         $scope.cancelButton = false;
        //     }
        // };
        //
        // $scope.isActiveCancel();
    }
  else if(window.localStorage.getItem("currentBookingId")){
       firebase.database().ref('bookings/' + window.localStorage.getItem("currentBookingId")).once('value', function (response) {
           if (response.val()) {
               $scope.bookingInformation = response.val();
               $scope.vendorId = response.val().vendorId;
               db.ref('vendors/'+locationInfo.cityId+'/'+$scope.vendorId).once('value', function(response){
                   if(response.val()){
                       $scope.bookingInformation.venue = response.val().vendorName;
                       $scope.bookingInformation.address1 = response.val().address.address1;
                       $scope.bookingInformation.address2 = response.val().address.address2;
                       $scope.bookingInformation.vendorLat = response.val().address.latitude;
                       $scope.bookingInformation.vendorLong = response.val().address.longitude;
                       $scope.bookingInformation.vendorName = response.val().contactDetails.name;
                       $scope.vendorAddress = response.val();
                       $ionicLoading.hide();
                   }
                   else{
                       $ionicLoading.hide();
                   }
               })
           }
       });
   }


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




    $scope.home = function(){
        window.localStorage.setItem("currentBookingId", '');
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
        };
        $scope.rate_vendor.show();
    };

    $scope.availed = function(){
        $scope.rate_vendor.show();
    };

    $scope.storeReview = function(){
        if($scope.custReview.rating == 0){
            alert('Please, select ratings!')
        }
        else{
            var updates = {};
            var reviewId = firebase.database().ref('reviews/'+$scope.bookingInformation.cityId+'/'+$scope.bookingInformation.vendorId+'/Reviews').push().key;
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
                $scope.review();
            });
        }
    };

    $scope.review = function() {
        var updates = {};
        updates['bookings/' + $scope.bookingInformation.bookingId + '/' + 'userStatus'] = 'Availed';
        updates['userBookings/' + localStorage.getItem('uid') + '/' + $scope.bookingInformation.bookingId] = 'Availed';
        updates['vendorBookings/' + $scope.bookingInformation.vendorId + '/' + $scope.bookingInformation.bookingId] = 'Availed';
        db.ref().update(updates).then(function () {
            delete window.localStorage.currentBooking;
            delete window.localStorage.activeBooking;
            $state.go('app.home');
            $ionicLoading.hide();
            alert('Your review has been submitted successfully!');
            $rootScope.$broadcast('booking', { message: 'booking changed' });

        });
    };

    $scope.notAvailed = function(){
        $ionicLoading.show();
        var updates = {};
        updates['bookings/'+$scope.bookingInformation.bookingId+'/'+'userStatus'] = 'notAvailed';
        updates['userBookings/'+localStorage.getItem('uid')+'/'+$scope.bookingInformation.bookingId] = 'notAvailed';
        updates['vendorBookings/'+$scope.bookingInformation.vendorId+'/'+$scope.bookingInformation.bookingId] = 'notAvailed';
        db.ref().update(updates).then(function(){
            delete window.localStorage.currentBooking;
            delete window.localStorage.activeBooking;
            $state.go('app.home');
            $ionicLoading.hide();
            alert('Thank you for updating your booking status!')
            $rootScope.$broadcast('booking', { message: 'booking changed' });


        });
    };


});