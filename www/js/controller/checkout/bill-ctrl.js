app.controller('BillCtrl', function($scope,$ionicLoading,$cordovaToast,$state,$timeout,
                                    $ionicModal,$rootScope,$ionicHistory){
    $ionicLoading.show();
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $timeout(function () {
        $ionicLoading.hide();
    }, 5000);
    $scope.cancelButton = false;
    $scope.vendorAddress = '';
    $scope.bookingInformation = {};
    var allBookingInfo = JSON.parse(window.localStorage['allBookingInfo'])
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
    var hasCurrentBooking = checkLocalStorage('BookingIdToMarkStatus');
    if(hasCurrentBooking){
         $scope.bookingIdToMarkStatus = window.localStorage['BookingIdToMarkStatus'];
        db.ref('bookings/'+$scope.bookingIdToMarkStatus).once('value',function (response) {
            if(response.val()){
                $scope.bookingInformation = response.val();
                vendorInfo($scope.bookingInformation.vendorId);
            }
            else{
                $ionicLoading.hide();
            }

        })
        $scope.cancelButton = true;
    }
    else if(window.localStorage.getItem("currentBookingId")){
       firebase.database().ref('bookings/' + window.localStorage.getItem("currentBookingId")).once('value', function (response) {
           if (response.val()) {
               $scope.bookingInformation = response.val();
               vendorInfo($scope.bookingInformation.vendorId)
           }
           else{
               $ionicLoading.hide()
           }
       });
    }

    function vendorInfo() {
        db.ref('vendors/'+locationInfo.cityId+'/vendors/'+$scope.vendorId).once('value', function(response){
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

     //////////Map for vendor location  ////////////////////////////////
    $scope.open_map = function(latitude,longitude,line1,line2,vendorName){
        $state.go('map',{
            'lat': latitude,
            'lng': longitude,
            'add1': line1,
            'add2': line2,
            'name': vendorName
        });
    };
    //////////////////////       end    ////////////////////////////////////////
    $scope.home = function(){
        delete window.localStorage.currentBookingId;
        $state.go('app.home');
    };

    //////////////////////  Booking Availed   //////////////////////////////////////
    $scope.availed = function(){
        $scope.rate_vendor.show();
    };
    $scope.close_modal = function () {
        $scope.rate_vendor.hide();
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


    $scope.storeReview = function(){
        if($scope.custReview.rating == 0){
            $cordovaToast
                .show('Please, select ratings!', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
        else{
            var updates = {};
            var reviewData = {};
            var reviewId = firebase.database().ref('reviews/'+$scope.bookingInformation.cityId+'/'+
            $scope.bookingInformation.vendorId+'/Reviews').push().key;
            firebase.database().ref('users/data/'+localStorage.getItem('uid')).once('value',function(response) {
                if(response.val()){
                    if(response.val().photoUrl){
                        reviewData = {
                            'ReviewId':reviewId,
                            'BookingId':$scope.bookingInformation.bookingId,
                            'userId':localStorage.getItem('uid'),
                            'ReviewText':$scope.custReview.review,
                            'ReviewRating':$scope.custReview.rating,
                            'VendorId':$scope.bookingInformation.vendorId,
                            'cityName':locationInfo.cityName,
                            'ReviewDate':new Date().getTime(),
                            'name':response.val().name,
                            'image':response.val()
                        };
                    }
                    else{
                        reviewData = {
                            'ReviewId':reviewId,
                            'BookingId':$scope.bookingInformation.bookingId,
                            'userId':localStorage.getItem('uid'),
                            'ReviewText':$scope.custReview.review,
                            'ReviewRating':$scope.custReview.rating,
                            'VendorId':$scope.bookingInformation.vendorId,
                            'cityName':locationInfo.cityName,
                            'ReviewDate':new Date().getTime(),
                            'name':response.val().name,
                            'image':''
                        };
                    }
                    var userReviewData = {
                        'VendorId':$scope.bookingInformation.vendorId,
                        'cityId':$scope.bookingInformation.cityId,
                        'cityName':locationInfo.cityName
                    }
                    updates['reviews/'+$scope.bookingInformation.cityId+'/'+$scope.bookingInformation.vendorId+'/Reviews/'+reviewData.ReviewId] = reviewData;
                    updates['userReviews/'+localStorage.getItem('uid')+'/'+reviewData.ReviewId] = userReviewData;
                    updates['bookings/' + $scope.bookingInformation.bookingId + '/' + 'reviewId'] = reviewId;
                    db.ref().update(updates).then(function () {
                       updateBookingInfo();
                    });

                }
                else{
                    $cordovaToast
                        .show('Something went wrong!', 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function (error) {
                            // error
                        });
                }
            })

        }
    };

    function updateBookingInfo() {
        var updates = {};
        updates['bookings/' + $scope.bookingInformation.bookingId + '/' + 'userStatus'] = 'Availed';
        updates['userBookings/' + localStorage.getItem('uid') + '/' + $scope.bookingInformation.bookingId] = 'Availed';
        updates['vendorBookings/' + $scope.bookingInformation.vendorId + '/' + $scope.bookingInformation.bookingId] = 'Availed';
        db.ref().update(updates).then(function () {
            ///// delete booking id from local storage ///////
            delete allBookingInfo[$scope.bookingIdToMarkStatus];
            window.localStorage['allBookingInfo'] = JSON.stringify(allBookingInfo);
            delete window.localStorage.BookingIdToMarkStatus;
            $ionicLoading.hide();
            $cordovaToast
                .show('Your review has been submitted successfully!', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
            $scope.rate_vendor.hide();
            $state.go('app.home');
            $rootScope.$broadcast('booking', { message: 'booking changed' });

        });
    };

    //////////////////////////////////////////////end mark availed booking  ///////////////

    ///////////////////////////////Mark status not availed booking  /////////////////////////

    $scope.notAvailed = function(){
        $ionicLoading.show();
        var updates = {};
        updates['bookings/'+$scope.bookingInformation.bookingId+'/'+'userStatus'] = 'notAvailed';
        updates['userBookings/'+localStorage.getItem('uid')+'/'+$scope.bookingInformation.bookingId] = 'notAvailed';
        updates['vendorBookings/'+$scope.bookingInformation.vendorId+'/'+$scope.bookingInformation.bookingId] = 'notAvailed';
        db.ref().update(updates).then(function(){
            ///// delete booking id from local storage ///////
             delete allBookingInfo[$scope.bookingIdToMarkStatus];
             window.localStorage['allBookingInfo'] = JSON.stringify(allBookingInfo);
             delete window.localStorage.BookingIdToMarkStatus;
            $state.go('app.home');
            $ionicLoading.hide();
            $rootScope.$broadcast('booking', { message: 'booking changed' });
        });
    };

});