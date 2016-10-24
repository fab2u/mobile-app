app.controller('VendorDetailsCtrl',
    function($scope, $ionicSlideBoxDelegate, $ionicModal,$stateParams,$state,
             $ionicPopup,$ionicLoading,$rootScope,$cordovaDevice,$cordovaInAppBrowser,$cordovaToast){



        $scope.images =[];
        $scope.reviewerName = '';
        $scope.reviewerImage = '';
        $scope.cart_item = '';
        $scope.selectedServices = {};
        $scope.begItems = {};
        $scope.menu_button = true;
        $scope.review_info = [];


        if(window.localStorage.getItem("selectedTab")=='true'){
            $scope.menu_button = false;
        }

        // Get selected services if previously stored in localstorage
        if ((localStorage.getItem("slectedItem") != null) && (localStorage.getItem('BegItems'))) {
            $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
            $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));
            $scope.cart_item = _.size($scope.selectedServices);
        }

        $rootScope.$on('cart', function (event, args) {
            $scope.message = args.message;
            $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
            $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));
            $scope.cart_item = _.size($scope.selectedServices);
        });

    $scope.vendorDetail = function() {
        $ionicLoading.show();
        firebase.database().ref('vendors/' + JSON.parse(window.localStorage['selectedLocation']).cityId + '/' + $stateParams.ven_id).once('value', function (response) {
           if(response.val()){
               $scope.vendor_detail = response.val();
               $ionicLoading.hide();
               angular.forEach(response.val().images.gallery, function (value, key) {
                   $scope.images.push({id: key, src: value.url})
               });
           }
           else{
               $scope.msg1 = 'No,menu found for this vendor!'
               $ionicLoading.hide();

           }

        });
    };
     $scope.vendorDetail();
  $scope.currentValue = 0;
  $scope.liked = false;

  $scope.likeVendor = function(){
      var key = db.ref('favourites/'+localStorage.getItem('uid')).push().key;
      var favouriteData = {
          vendorId:$stateParams.ven_id,
          cityId:$scope.vendor_detail.address.cityId,
          vendorName:$scope.vendor_detail.vendorName,
          vendorLandmark:$scope.vendor_detail.address.landmark,
          vendorImg:$scope.vendor_detail.images.main.url
      };
      if(localStorage.getItem('uid') && key){
          firebase.database().ref('favourites/'+localStorage.getItem('uid')+'/'+key)
              .set(favouriteData,function(response) {
                  if(response ==null){
                      $scope.liked  = !$scope.liked ;
                      $cordovaToast
                          .show('Vendor added to your favorite list.', 'long', 'center')
                          .then(function(success) {
                              // success
                          }, function (error) {
                              // error
                          });
                  }
              })
      }
      else{
          $cordovaToast
              .show('Please login.', 'long', 'center')
              .then(function(success) {
                  // success
              }, function (error) {
                  // error
              });
      }

  };

	$scope.next = function() {
    	$ionicSlideBoxDelegate.next();
  	};
  	$scope.previous = function() {
    	$ionicSlideBoxDelegate.previous();
  	};

  	// // Called each time the slide changes
  	// $scope.slideChanged = function(index) {
   //    console.log($ionicSlideBoxDelegate.currentIndex());
   //  	$scope.slideIndex = index;
   //    console.log(index);
  	// };


        ////// To get vendor fav or not //////////////


        if(localStorage.getItem('uid')){
            firebase.database().ref('favourites/'+localStorage.getItem('uid'))
                .once('value',function(response) {
                    angular.forEach(response.val(),function (value,key) {
                        if(value.vendorId == $stateParams.ven_id){
                            $scope.liked = true;
                        }
                    })
                })
        }

/// To get review for a particular vendor ///////
        $scope.reviewList = function(){
            $scope.review_info = [];
            $ionicLoading.show();
            firebase.database().ref('reviews/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.ven_id+'/Reviews').once('value',function(response){
                $scope.reviews = response.val();
                if(response.val()){
                    angular.forEach(response.val(), function(value, key) {
                        firebase.database().ref('users/data/'+value.userId).once('value',function(response) {
                            $ionicLoading.hide();
                            value.name = response.val().name;
                            value.image = response.val().photoUrl;
                            $scope.review_info.push(value);
                        })
                     });
                }
                else if(response.val() == null){
                    $scope.msg = 'No,reviews found!'
                    $ionicLoading.hide();
                }
                console.log("reviews",$scope.review_info)
            });
        };
        $rootScope.$on('reviewList', function (event, args) {
            $scope.message = args.message;
            $scope.reviewList();
        });
    $scope.slideHasChanged = function(value){
      console.log(value);
        if(value == 2){
            $scope.reviewList();
        }
      $scope.currentValue = value;
    };

    $scope.more = false;


        $scope.days = [];
        var d = new Date();
        var weekday = new Array(7);
        weekday[0]=  "sunday";
        weekday[1] = "monday";
        weekday[2] = "tuesday";
        weekday[3] = "wednesday";
        weekday[4] = "thursday";
        weekday[5] = "friday";
        weekday[6] = "saturday";

        var n = weekday[d.getDay()];

    $scope.showVendorTiming = function(time_info){
        angular.forEach(time_info, function(value, key) {
            if(key == n){
                $scope.today_end_time = value.pm;
            }
            // $scope.days.push({name : key,startTime:value.am , endTime:value.pm})
            $scope.days.push({name : key,Times:value})
        });
        $scope.more = !$scope.more;
    };




        $scope.open_map = function(latitude,longitude,line1,line2,vendorName){
       $state.go('map',{
                'lat': latitude,
                'lng': longitude,
                'add1': line1,
                'add2': line2,
                'name': vendorName
        });
    };

    $scope.starrating=function(rating) {
      return new Array(rating);   //ng-repeat will run as many times as size of array
    };

   $scope.changeSlide = function(val){
      $scope.currentValue = val;
      $ionicSlideBoxDelegate.$getByHandle('vendorMainDetails').slide(val);
   };




        $scope.get_distance = function(latitude1,longitude1,latitude2,longitude2,units) {
            var p = 0.017453292519943295;    //This is  Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((latitude2 - latitude1) * p)/2 +
                c(latitude1 * p) * c(latitude2 * p) *
                (1 - c((longitude2 - longitude1) * p))/2;
            var R = 6371; //  Earth distance in km so it will return the distance in km
            $scope.dist = Math.round(2 * R * Math.asin(Math.sqrt(a)));
            if($scope.dist){
                return true;
            }
            else{
                return false;
            }

        };

    $scope.aImages = [{
        'src' : 'http://ionicframework.com/img/ionic-logo-blog.png', 
        'msg' : 'Swipe me to the left. Tap/click to close'
      }, {
        'src' : 'http://ionicframework.com/img/ionic-logo-blog.png', 
        'msg' : ''
      }, { 
        'src' : 'http://ionicframework.com/img/ionic-logo-blog.png', 
        'msg' : ''
    }];
  
    $ionicModal.fromTemplateUrl('templates/vendor/image.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $ionicSlideBoxDelegate.$getByHandle('ImgGallery').slide(0);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.goToSlide = function(value){
      $ionicSlideBoxDelegate.$getByHandle('ImgGallery').slide(value);
      $scope.modal.show();
    };

    $scope.cart = function(){
        if(_.size($scope.selectedServices)>0){
            $state.go('cart',{'ven_id':$stateParams.ven_id});
        }
        else{
            $cordovaToast
                .show('Please select at least one service.', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
    };

    $scope.vendorMenu = function(){
        if(window.localStorage.getItem("selectedTab")=='true'){
            $state.go('vendorSelectedMenu',{vendor_id:$stateParams.ven_id});
        }
        else{
            $state.go('vendorMenu',{'vendor_id':$stateParams.ven_id})

        }
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

        $scope.storeReview = function(){
            if(localStorage.getItem('uid')){
                if($scope.custReview.rating == 0){
                    $cordovaToast
                        .show('Please, select rating', 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function (error) {
                            // error
                        });
                }
                else{
                    var updates = {};
                    var reviewId = firebase.database().ref('reviews/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.ven_id+'/Reviews').push().key;
                    var reviewData = {
                        'ReviewId':reviewId,
                        'BookingId':'',
                        'userId':localStorage.getItem('uid'),
                        'ReviewText':$scope.custReview.review,
                        'ReviewRating':$scope.custReview.rating,
                        'VendorId':$stateParams.ven_id,
                        'cityName':JSON.parse(window.localStorage['selectedLocation']).cityName
                    };
                    var userReviewData = {
                        'VendorId':$stateParams.ven_id,
                        'cityId':JSON.parse(window.localStorage['selectedLocation']).cityId,
                        'cityName':JSON.parse(window.localStorage['selectedLocation']).cityName

                    }
                    updates['reviews/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.ven_id+'/Reviews/'+reviewData.ReviewId] = reviewData;
                    updates['userReviews/'+localStorage.getItem('uid')+'/'+reviewData.ReviewId] = userReviewData;
                    db.ref().update(updates).then(function () {
                        $scope.custReview ={};
                        location.reload();
                        $ionicLoading.hide();
                        $rootScope.$broadcast('reviewList', { message: 'review list changed' });
                        $cordovaToast
                            .show('Thanks for reviewing, your feedback is important to us.', 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function (error) {
                                // error
                            });
                        $scope.rate_vendor.hide();
                    });
                }
            }
            else{
                $cordovaToast
                    .show('Please login first!', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            }
        };


});