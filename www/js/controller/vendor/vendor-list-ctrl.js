app.controller('VendorListCtrl', ['$scope','$ionicHistory','$state', function($scope,$ionicHistory,$state,$stateParams){

    // $scope.location_info = JSON.parse(window.localStorage['selectedLocation']).cityId;


    firebase.database().ref('vendors/'+JSON.parse(window.localStorage['selectedLocation']).cityId).once('value',function(response){
        $scope.vendor_list = response.val();
    });



    $scope.backButton = function () {
        $state.go($ionicHistory.backView().stateName);
    };

    // $scope.rating = 3;
    function defaultColor() {
        male.classList.add('is-active');
        female.classList.remove('is-active');
    }
    defaultColor();
    $scope.toggleColor = function () {
      var female = document.getElementById('female');
      var male = document.getElementById('male');
      if(male.classList.contains('is-active')) {
        male.classList.remove('is-active');
        female.classList.add('is-active');
      }
      else {
        male.classList.add('is-active');
        female.classList.remove('is-active');
      }
    };
    
    $scope.starRating = function(rating) {
      return new Array(rating);   //ng-repeat will run as many times as size of array
   };

   $scope.vendor_detail = function(id){
       $state.go('vendorDetails',{'vendor_id':id});
   }
}]);