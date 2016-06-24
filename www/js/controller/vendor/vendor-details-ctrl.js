app.controller('VendorDetailsCtrl', ['$scope', '$ionicSlideBoxDelegate', '$ionicModal',function($scope, $ionicSlideBoxDelegate, $ionicModal){

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
    }

    $scope.more = false;

    $scope.showVendorTiming = function(){
      console.log("working");
      console.log($scope.more);
      $scope.more = !$scope.more;
    }

    $scope.starrating=function(rating) {
      return new Array(rating);   //ng-repeat will run as many times as size of array
    }

   $scope.changeSlide = function(val){
      $scope.currentValue = val;
      $ionicSlideBoxDelegate.$getByHandle('vendorMainDetails').slide(val);
   }

    $scope.days = [
      {name: 'MON', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'TUE', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'WED', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'THU', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'FRI', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'SAT', startTime: '9:00 AM', endTime: '9:00 PM'},
      {name: 'SUN', startTime: '9:00 AM', endTime: '9:00 PM'}
    ];

    $scope.images = [
      {id:'1', src:'http://placehold.it/50x50'},
      {id:'2', src:'http://placehold.it/50x50'},
      {id:'3', src:'http://placehold.it/50x50'},
      {id:'4', src:'http://placehold.it/50x50'},
      {id:'5', src:'http://theflaticons.com/wp-content/uploads/2015/09/girl.png'},
      {id:'6', src:'http://placehold.it/50x50'},
      {id:'7', src:'http://placehold.it/50x50'},
      {id:'8', src:'http://placehold.it/50x50'},
      {id:'9', src:'http://placehold.it/50x50'},
      {id:'10', src:'http://placehold.it/50x50'},
      {id:'11', src:'http://placehold.it/50x50'}
    ];

    $scope.isPresent= function(value) {
      if(value == 1 || value == 3 || value == 4 || value == 5){
        return true;
      } else {
        return false;
      }
    }

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
    }

}]);