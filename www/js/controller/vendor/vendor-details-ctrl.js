app.controller('VendorDetailsCtrl', ['$scope', '$ionicSlideBoxDelegate', '$ionicModal','$stateParams','$state','$cordovaGeolocation',
    function($scope, $ionicSlideBoxDelegate, $ionicModal,$stateParams,$state,$cordovaGeolocation){


        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)

            .then(function (position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                console.log(lat + '   ' + long)
            }, function(err) {
                console.log(err)
            });

        // var watchOptions = {timeout : 3000, enableHighAccuracy: false};
        // var watch = $cordovaGeolocation.watchPosition(watchOptions);
        //
        // watch.then(
        //     null,
        //
        //     function(err) {
        //         console.log(err)
        //     },
        //
        //     function(position) {
        //         var lat  = position.coords.latitude
        //         var long = position.coords.longitude
        //         console.log(lat + '' + long)
        //     }
        // );
        //
        // watch.clearWatch();


        // here after vendor string will change later as per city selected by user
      $scope.images =[];

    firebase.database().ref('vendors/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.vendor_id).once('value',function(response){
        $scope.vendor_detail = response.val();
        angular.forEach(response.val().images, function(value, key) {
            $scope.images.push({id : key, src:value.url})
        });
    });




  $scope.currentValue = 0;
  $scope.liked = false;

  $scope.likeVendor = function(){
    console.log('clicked');
    $scope.liked  = !$scope.liked ;
  }

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

    $scope.slideHasChanged = function(value){
      console.log(value);
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
            console.log(key,value);
            if(key == n){
                $scope.today_end_time = value.pm;
            }
            $scope.days.push({name : key,startTime:value.am , endTime:value.pm})
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

    $scope.reviews = [
      {name: 'Anu',rating: 3,review: 'This example demonstrates how to display the entire text when hover over the element.',image: 'http://theflaticons.com/wp-content/uploads/2015/09/girl.png'},
      {name: 'Aadhu',rating: 5,review: 'Headers are fixed regions at the top of a screen that can contain a title labe',image: 'http://icons.iconarchive.com/icons/dapino/people/512/orange-boy-icon.png'},
      {name: 'Aastha',rating: 4,review: 'A secondary header bar can be placed below the original header bar',image: 'http://theflaticons.com/wp-content/uploads/2015/09/girl.png'},
      {name: 'Anu',rating: 3,review: 'This example demonstrates how to display the entire text when hover over the element.',image: 'http://theflaticons.com/wp-content/uploads/2015/09/girl.png'},
      {name: 'Aadhu',rating: 5,review: 'Headers are fixed regions at the top of a screen that can contain a title labe',image: 'http://icons.iconarchive.com/icons/dapino/people/512/orange-boy-icon.png'},
      {name: 'Aastha',rating: 4,review: 'A secondary header bar can be placed below the original header bar',image: 'http://theflaticons.com/wp-content/uploads/2015/09/girl.png'}
    ];

   
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
        $state.go('cart');
    }

}]);